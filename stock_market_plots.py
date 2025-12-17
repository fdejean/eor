import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from src.data.loaders import get_property_columns
from src.utils.stock_market_utils import map_subreddit_to_security, find_similar_subreddits, load_stock_df, prep_stock_df, monthly_volatility, compute_correlations

GLOBAL_VARS = {}

def initialize_vars(df_hyperlink: pd.DataFrame, df_stock: pd.DataFrame, brands: list[tuple[str, float]], brand: str, df_embeddings: pd.DataFrame = None, path_finance: str = None, start_date: str = "2014-01-01", end_date: str = "2017-05-01") -> None:
    """
    Process the values for a given brand and store them in global variables for plotting.
    Also computes aggregate correlations across all brands.

    Args:
        df_hyperlink: DataFrame containing hyperlink data.
        df_stock: DataFrame containing stock data.
        brands: List of brand subreddit names to filter the data.
        brand: Brand name to analyze.
        df_embeddings: DataFrame containing subreddit embeddings (required for aggregate analysis).
        path_finance: Path to finance dataset (for aggregate analysis).
        start_date: Start date for stock data filtering.
        end_date: End date for stock data filtering.
    
    Returns:
        None
    """
    global GLOBAL_VARS
    brand_names = [brand[0] for brand in brands]
    brand_data = df_hyperlink[(df_hyperlink['SOURCE_SUBREDDIT'].str.lower().isin(brand_names)) | (df_hyperlink['TARGET_SUBREDDIT'].str.lower().isin(brand_names))].copy()
    brand_data['TIMESTAMP'] = pd.to_datetime(brand_data['TIMESTAMP'])

    total_data = brand_data.set_index('TIMESTAMP')["LINK_SENTIMENT"].resample('ME').sum() 
    monthly_std = brand_data.set_index('TIMESTAMP')["LINK_SENTIMENT"].resample('ME').std()
    negativity_data = brand_data[brand_data['LINK_SENTIMENT'] < 0].set_index('TIMESTAMP')["LINK_SENTIMENT"].resample('ME').sum() * -1 # Invert to positive for visualization
    monthly_vader_compound_std = brand_data.set_index('TIMESTAMP')["vader_compound"].resample('ME').std()
    monthly_vader_negative_std = brand_data.set_index('TIMESTAMP')["vader_neg"].resample('ME').std()
    monthly_vader_compound_sum = brand_data.set_index('TIMESTAMP')["vader_compound"].resample('ME').sum()
    monthly_vader_negative_sum = brand_data.set_index('TIMESTAMP')["vader_neg"].resample('ME').sum()
    
    weekly_total_data = brand_data.set_index('TIMESTAMP')["LINK_SENTIMENT"].resample('W').sum()
    weekly_negativity_data = brand_data[brand_data['LINK_SENTIMENT'] < 0].set_index('TIMESTAMP')["LINK_SENTIMENT"].resample('W').sum() * -1
    
    df_stock = prep_stock_df(df_stock)

    # Compute aggregate correlations across all brands if path_finance is provided
    aggregate_df = pd.DataFrame()  # Initialize as empty DataFrame
    if path_finance is not None and df_embeddings is not None:
        all_brand_results = {}
        for brand_name, brand_ticker in map_subreddit_to_security.items():
            try:
                brands_similar = find_similar_subreddits(brand_name, df_embeddings)
                if not brands_similar:
                    print(f"No similar subreddits found for {brand_name}")
                    continue
                    
                subs = [s[0].lower() for s in brands_similar]
                
                brand_df = df_hyperlink[
                    (df_hyperlink["SOURCE_SUBREDDIT"].str.lower().isin(subs)) |
                    (df_hyperlink["TARGET_SUBREDDIT"].str.lower().isin(subs))
                ].copy()
                if brand_df.empty:
                    print(f"No hyperlink data found for {brand_name}")
                    continue
                
                brand_df["TIMESTAMP"] = pd.to_datetime(brand_df["TIMESTAMP"])


                stock = load_stock_df(brand_name, path_finance)
                if stock.empty:
                    print(f"No stock data found for {brand_name} ({brand_ticker})")
                    continue
                
                stock = prep_stock_df(stock)
                price_vol_m, volume_vol_m = monthly_volatility(stock, 7, "ME")
                
                # Add all LIWC features
                features = get_property_columns()

                # Add all the 
                corr_df = compute_correlations(brand_df, price_vol_m, volume_vol_m, features, "ME")
                if corr_df.empty:
                    print(f"No correlations computed for {brand_name}")
                    continue
                
                all_brand_results[brand_ticker] = {
                    "name": brand_name,
                    "data": corr_df,
                    "subreddit_count": len(subs),
                    "post_count": len(brand_df)
                }
            except Exception as e:
                continue
        
        # Aggregate across brands
        if all_brand_results:
            agg_collect = {}
            for ticker, res in all_brand_results.items():
                df = res["data"]
                for _, r in df.iterrows():
                    f = r["Feature"]
                    agg_collect.setdefault(f, []).append({
                        "ticker": ticker, "r_price": r["r_price"], "r_volume": r["r_volume"], "r_avg": r["r_avg"]
                    })
            
            aggregate_rows = []
            for f, vals in agg_collect.items():
                price = np.array([v["r_price"] for v in vals], dtype=float)
                volume = np.array([v["r_volume"] for v in vals], dtype=float)
                avg = np.array([v["r_avg"] for v in vals], dtype=float)
                aggregate_rows.append({
                    "Feature": f,
                    "Avg Price Corr": float(np.mean(price)),
                    "Avg Volume Corr": float(np.mean(volume)),
                    "Avg Overall Corr": float(np.mean(avg)),
                    "Std Price Corr": float(np.std(price)),
                    "Std Volume Corr": float(np.std(volume)),
                    "Max Price Corr": float(np.max(np.abs(price))),
                    "Max Volume Corr": float(np.max(np.abs(volume))),
                    "Brands Analyzed": int(len(vals)),
                    "Consistency": float(np.mean(np.abs(avg) > 0.10))
                })
            
            aggregate_df = pd.DataFrame(aggregate_rows)
            aggregate_df["Abs Avg Overall"] = aggregate_df["Avg Overall Corr"].abs()
            aggregate_df = aggregate_df.sort_values("Abs Avg Overall", ascending=False).reset_index(drop=True)
            print(f"Computed aggregate correlations: {len(aggregate_df)} features across {len(all_brand_results)} brands")

    GLOBAL_VARS = {
        "brand" : brand,
        "brands": brand_names,
        "df_hyperlink": df_hyperlink,
        "brand_data": brand_data,
        "df_stock": df_stock,
        "total_data": total_data,
        "monthly_std": monthly_std,
        "negativity_data": negativity_data,
        "monthly_vader_compound_std": monthly_vader_compound_std,
        "monthly_vader_negative_std": monthly_vader_negative_std,
        "monthly_vader_compound_sum": monthly_vader_compound_sum,
        "monthly_vader_negative_sum": monthly_vader_negative_sum,
        "weekly_total_data": weekly_total_data,
        "weekly_negativity_data": weekly_negativity_data,
        "aggregate_df": aggregate_df
    }

def plot_monthly_sentiment_brand(ax: plt.Axes):
    """
    Plot montly sentiment related to a specific brand

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None
    """

    axes_right = ax.twinx()
    ax.set_title(f'Monthly Posts sentiment targeting {GLOBAL_VARS["brand"]}')
    ax.set_xlabel('Date')
    ax.set_ylabel('Link Sentiment', color='blue')
    
    # Set bar width and calculate offsets
    bar_width = 10
    offset = pd.Timedelta(days=bar_width/2)
    
    ax.plot(GLOBAL_VARS["total_data"].index, GLOBAL_VARS["total_data"].values, "-o", markersize=2, label='Total Sentiment towards {}'.format(GLOBAL_VARS["brand"]), color='blue')
    ax.bar(GLOBAL_VARS["negativity_data"].index - offset, GLOBAL_VARS["negativity_data"].values, alpha=0.7, width=bar_width, color='red', label='Negative Sentiment targeting {}'.format(GLOBAL_VARS["brand"]))
    ax.tick_params(axis='y', labelcolor='blue')

    axes_right.plot(GLOBAL_VARS["monthly_vader_compound_sum"].index, GLOBAL_VARS["monthly_vader_compound_sum"].values, "-o", markersize=3, color='purple', linewidth=2, label='Vader Compound Sum')
    axes_right.bar(GLOBAL_VARS["monthly_vader_negative_sum"].index + offset, GLOBAL_VARS["monthly_vader_negative_sum"].values, alpha=0.7, width=bar_width, color='mediumpurple', label='Vader Negative Sum')
    axes_right.set_ylabel('Vader Metrics', color='purple')
    axes_right.tick_params(axis='y', labelcolor='purple')
    
    # Align both y-axes to start at 0
    ax.set_ylim(bottom=0)
    axes_right.set_ylim(bottom=0)

    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = axes_right.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

def plot_monthly_volatility_brand(ax: plt.Axes):
    """
    Plot montly volatility related to a specific brand

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None
    """

    ax.plot(GLOBAL_VARS["monthly_std"].index, GLOBAL_VARS["monthly_std"].values, "-o", markersize=3, color='orange', linewidth=2, label='Sentiment Volatility')
    axes_right = ax.twinx()
    axes_right.plot(GLOBAL_VARS["monthly_vader_compound_std"].index, GLOBAL_VARS["monthly_vader_compound_std"].values, "-o", markersize=3, color='purple', linewidth=2, label='Vader Compound Std Dev')

    ax.set_title(f'Monthly Standard Deviation of Posts sentiment targeting {GLOBAL_VARS["brand"]}')
    ax.set_xlabel('Date')
    ax.set_ylabel('Sentiment Volatility', color='orange')
    axes_right.set_ylabel('Vader Volatility', color='purple')
    ax.tick_params(axis='y', labelcolor='orange')
    axes_right.tick_params(axis='y', labelcolor='purple')

    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = axes_right.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

def plot_monthly_emotion_volatility_brand(ax: plt.Axes):
    """
    Plot montly emotion volatility related to a specific brand

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None
    """

    emotion_factors = [['LIWC_Affect', 'affection'], ['LIWC_Anx', 'anxiety'], ['LIWC_Anger', 'anger'], ['LIWC_Sad', 'sadness']]

    # Convert emotion columns to numeric
    for factor, _ in emotion_factors:
        GLOBAL_VARS["brand_data"][factor] = pd.to_numeric(GLOBAL_VARS["brand_data"][factor], errors='coerce')

    # Prepare data for stacked bar chart - use STD (volatility) instead of MEAN
    monthly_emotions = {}
    for factor, _ in emotion_factors:
        monthly_emotions[factor] = GLOBAL_VARS["brand_data"].set_index('TIMESTAMP')[factor].resample('ME').std()

    # Get common dates for all emotions
    common_dates = monthly_emotions['LIWC_Affect'].index
    emotion_values = {factor: monthly_emotions[factor].loc[common_dates].values for factor, _ in emotion_factors}

    # Create stacked bar chart
    bottom = np.zeros(len(common_dates))
    colors_emotion = ['#66BB6A', '#EF5350', '#4ECDC4', '#FFA07A', '#95E1D3']

    for i, (factor, name) in enumerate(emotion_factors):
        ax.bar(common_dates, emotion_values[factor], bottom=bottom, width=15,
                    alpha=0.8, label=name.title(), color=colors_emotion[i])
        bottom += emotion_values[factor]

    ax.set_title(f'Monthly Emotional Standard Deviation in posts targeting {GLOBAL_VARS["brand"]}')
    ax.set_xlabel('Date')
    ax.set_ylabel('Emotion Volatility (Std Dev)')
    ax.legend(loc='upper left')

def plot_stock_price_volume(ax: plt.Axes) -> None:
    """
    Plot stock closing price and volume on dual y-axes by date.
    Using loaded stock data from global variables.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None (plot stock closing price and volum)
    """

    df_stock = GLOBAL_VARS["df_stock"]

    x = df_stock.index
    y_close = df_stock['Close']
    y_vol = df_stock['Volume'] / 1_000_000

    ax2 = ax.twinx()

    ax.plot(x, y_close, "-o", markersize=2, label='Close Price', color='blue')
    ax2.bar(x, y_vol, alpha=0.3, width=2, color='red', label='Volume in Millions')

    ax.set_title(f'Stock price for {GLOBAL_VARS["brand"]} ({map_subreddit_to_security[GLOBAL_VARS["brand"]]})')
    ax.set_xlabel('Date')
    ax.set_ylabel('Price')
    ax.tick_params(axis='y')
    ax2.set_ylabel('Volume in Millions')
    ax2.tick_params(axis='y')

    # Combine legends from both axes
    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2)

def plot_monthly_stock_price_volume_volatility(ax: plt.Axes) -> None:
    """
    Plot stock closing price and volume volatility on dual y-axes by date.
    Using loaded stock data from global variables.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None (plot stock closing price and volume volatility)
    """

    df_stock = GLOBAL_VARS["df_stock"]

    x = df_stock.index
    y_volatility = df_stock['Close'].pct_change().rolling(window=30).std()

    ax2 = ax.twinx()
    ax.plot(x, y_volatility * 100, "-o", markersize=2, label='Close Price Volatility', color='green')
    ax.set_title(f'Stock Price Volatility for {GLOBAL_VARS["brand"]} ({map_subreddit_to_security[GLOBAL_VARS["brand"]]})')
    ax.set_xlabel('Date')
    ax.set_ylabel('Volatility (%)')
    ax.legend()

    ax2.plot(x, df_stock["Volume"].pct_change().rolling(window=7).std() * 100, "-o", markersize=2, label='Volume Volatility', color='orange')
    ax2.set_ylabel('Volume Volatility (%)')
    ax2.tick_params(axis='y')

def plot_monthly_price_spread(ax: plt.Axes) -> None:
    """
    Plot monthly stock price spread (High - Low) as a bar chart.
    Using loaded stock data from global variables.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None (plot monthly stock price spread)
    """

    df_stock = GLOBAL_VARS["df_stock"]

    monthly_high = df_stock['High'].resample('ME').max()
    monthly_low = df_stock['Low'].resample('ME').min()
    monthly_spread = monthly_high - monthly_low

    ax.bar(monthly_spread.index, monthly_spread.values, width=15, color='purple', alpha=0.7)
    ax.set_title(f'Monthly Stock Price Spread for {GLOBAL_VARS["brand"]} ({map_subreddit_to_security[GLOBAL_VARS["brand"]]})')
    ax.set_xlabel('Date')
    ax.set_ylabel('Price Spread (High - Low)')

def plot_weekly_sentiment_std_vs_stock_price_std(ax: plt.Axes) -> None:
    """
    Plot weekly sentiment against stock price volatility (std) on dual y-axes.
    Using loaded stock data from global variables.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None (plot weekly sentiment against stock price volatility)
    """
    df_stock = GLOBAL_VARS["df_stock"]
    
    y_price_volatility = df_stock["Close"].pct_change().rolling(window=30).std()
    
    # Primary axis (left): sentiment
    ax.plot(GLOBAL_VARS["weekly_total_data"].index, GLOBAL_VARS["weekly_total_data"].values, "-o", markersize=2, label='Total Sentiment', color='blue')
    ax.bar(GLOBAL_VARS["weekly_negativity_data"].index, GLOBAL_VARS["weekly_negativity_data"].values, alpha=0.5, width=5, color='red', label='Negative Sentiment')
    ax.set_xlabel('Date')
    ax.set_ylabel('Sentiment', color='blue')
    ax.tick_params(axis='y', labelcolor='blue')
    
    # Secondary axis (right): volatility
    ax_volatility = ax.twinx()
    ax_volatility.plot(df_stock.index, y_price_volatility, "-o", markersize=2, label='Close Price Volatility', color='green')
    ax_volatility.set_ylabel('Volatility', color='green')
    ax_volatility.tick_params(axis='y', labelcolor='green')
    
    ax.set_title(f'Weekly Link Sentiment and Price Volatility for r/{GLOBAL_VARS["brand"]}')
    
    # Combine legends
    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax_volatility.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

def plot_weekly_sentiment_vs_stock_price(ax: plt.Axes):
    """
    Plot weekly sentiment against stock price on dual y-axes.
    Using loaded stock data from global variables.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None (plot weekly sentiment against stock price)
    """
    df_stock = GLOBAL_VARS["df_stock"]
    
    y_price = df_stock["Close"]
    
    # Primary axis (left): sentiment
    ax.plot(GLOBAL_VARS["weekly_total_data"].index, GLOBAL_VARS["weekly_total_data"].values, "-o", markersize=2, label='Total Sentiment', color='blue')
    ax.bar(GLOBAL_VARS["weekly_negativity_data"].index, GLOBAL_VARS["weekly_negativity_data"].values, alpha=0.5, width=5, color='red', label='Negative Sentiment')
    ax.set_xlabel('Date')
    ax.set_ylabel('Sentiment', color='blue')
    ax.tick_params(axis='y', labelcolor='blue')
    
    # Secondary axis (right): price
    ax_price = ax.twinx()
    ax_price.plot(df_stock.index, y_price, "-o", markersize=2, label='Close Price', color='green')
    ax_price.set_ylabel('Price', color='green')
    ax_price.tick_params(axis='y', labelcolor='green')
    
    ax.set_title(f'Weekly Link Sentiment and Price for r/{GLOBAL_VARS["brand"]}')
    
    # Combine legends
    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax_price.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

def plot_features_std_vs_price_std(ax: plt.Axes) -> None:
    """
    Plot top 20 features by average overall correlation across all brands.

    Args:
        ax: Matplotlib Axes object to plot on.

    Returns:
        None
    """

    aggregate_df = GLOBAL_VARS.get("aggregate_df")
    if aggregate_df is None or aggregate_df.empty:
        ax.text(0.5, 0.5, 'No aggregate data available', ha='center', va='center', transform=ax.transAxes)
        return
    
    top20 = aggregate_df.head(20)
    ax.barh(np.arange(len(top20)), top20["Avg Overall Corr"],
            color=["green" if v > 0 else "red" for v in top20["Avg Overall Corr"]], alpha=0.7)
    ax.set_yticks(np.arange(len(top20)))
    ax.set_yticklabels(top20["Feature"], fontsize=10)
    ax.set_xlabel("Average Correlation", fontweight="bold")
    ax.set_title("Top 20 Features by Avg Overall Correlation (All Brands)", fontweight="bold")
    ax.axvline(0, color="black", lw=0.8)
    ax.grid(True, alpha=0.3, axis="x")

def plot_features_std_vs_price_std_single_brand(ax: plt.Axes) -> None:
    """
    Plot top 20 features by overall correlation for the current brand only.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None
    """

    brand_data = GLOBAL_VARS.get("brand_data")
    df_stock = GLOBAL_VARS.get("df_stock")
    brand_name = GLOBAL_VARS.get("brand")
    
    if brand_data is None or brand_data.empty or df_stock is None or df_stock.empty:
        ax.text(0.5, 0.5, 'No brand data available', ha='center', va='center', transform=ax.transAxes)
        return
    
    # Compute price and volume volatility for the current brand
    price_vol_m, volume_vol_m = monthly_volatility(df_stock, 7, "ME")
    
    # Get LIWC features
    features = get_property_columns()
    
    # Compute correlations for the current brand
    corr_df = compute_correlations(brand_data, price_vol_m, volume_vol_m, features, "ME")
    
    if corr_df.empty:
        ax.text(0.5, 0.5, f'No correlations found for {brand_name}', ha='center', va='center', transform=ax.transAxes)
        return
    
    # Get top 20 features by average correlation
    top20 = corr_df.head(20)
    ax.barh(np.arange(len(top20)), top20["r_avg"],
            color=["green" if v > 0 else "red" for v in top20["r_avg"]], alpha=0.7)
    ax.set_yticks(np.arange(len(top20)))
    ax.set_yticklabels(top20["Feature"], fontsize=10)
    ax.set_xlabel("Correlation", fontweight="bold")
    ax.set_title(f"Top 20 Features by Correlation for {brand_name.title()}", fontweight="bold")
    ax.axvline(0, color="black", lw=0.8)
    ax.grid(True, alpha=0.3, axis="x")

def plot_features_std_vs_volume_std(ax: plt.Axes) -> None:
    """
    Plot Price vs Volume correlation scatter plot with consistency sizing.

    Args:
        ax: Matplotlib Axes object to plot on.
    
    Returns:
        None (Plot Price vs Volume correlation)
    """

    aggregate_df = GLOBAL_VARS.get("aggregate_df")
    if aggregate_df is None or aggregate_df.empty:
        ax.text(0.5, 0.5, 'No aggregate data available', ha='center', va='center', transform=ax.transAxes)
        return
    
    top30 = aggregate_df.head(30)
    sc = ax.scatter(top30["Avg Price Corr"], top30["Avg Volume Corr"],
                    s=top30["Consistency"]*500 + 50, alpha=0.6,
                    c=top30["Abs Avg Overall"], cmap="RdYlGn", edgecolors="black", linewidth=1)
    ax.axhline(0, color="black", ls="--", lw=1, alpha=0.3)
    ax.axvline(0, color="black", ls="--", lw=1, alpha=0.3)
    ax.set_xlabel("Average Price Correlation", fontweight="bold")
    ax.set_ylabel("Average Volume Correlation", fontweight="bold")
    ax.set_title("Price and Volume Correlation of a Feature", fontweight="bold")
    cbar = plt.colorbar(sc, ax=ax)
    cbar.set_label("Abs Avg Overall", fontsize=10)
    ax.grid(True, alpha=0.3)

def plot_features_std_vs_price_volume(axes, top_n: int = 10) -> None:
    """
    Plot top-N price and volume predictors side-by-side.

    Args:
        axes: Matplotlib Axes object(s) to plot on.
        top_n: Number of top features to display.
    
    Returns:
        None 
    """
    
    aggregate_df = GLOBAL_VARS.get("aggregate_df")
    if aggregate_df is None or aggregate_df.empty:
        axes.text(0.5, 0.5, 'No aggregate data available', ha='center', va='center', transform=axes.transAxes)
        return
    
    # Handle both single axis and array of axes
    if not isinstance(axes, np.ndarray):
        ax = axes
    else:
        ax = axes.flatten()[0] if axes.ndim > 1 else axes[0]
    
    best_price = aggregate_df.nlargest(top_n, "Avg Price Corr")
    best_volume = aggregate_df.nlargest(top_n, "Avg Volume Corr")
    
    y_price = np.arange(len(best_price))
    y_volume = np.arange(len(best_volume)) + len(best_price) + 1
    
    ax.barh(y_price, best_price["Avg Price Corr"],
            color=["green" if v > 0 else "red" for v in best_price["Avg Price Corr"]],
            alpha=0.7, label=f"Top {top_n} by Avg Price Corr")
    ax.barh(y_volume, best_volume["Avg Volume Corr"],
            color=["orange" if v > 0 else "purple" for v in best_volume["Avg Volume Corr"]],
            alpha=0.7, label=f"Top {top_n} by Avg Volume Corr")
    
    yticks = list(y_price) + list(y_volume)
    yticklabels = list(best_price["Feature"]) + list(best_volume["Feature"])
    ax.set_yticks(yticks)
    ax.set_yticklabels(yticklabels, fontsize=9)
    ax.set_xlabel("Average Correlation", fontweight="bold")
    ax.set_title("Top Features for Price and Volume (All brands)", fontweight="bold")
    ax.axvline(0, color="black", lw=0.8)
    ax.legend()
    ax.grid(True, alpha=0.3, axis="x")