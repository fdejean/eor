export interface RealWorldDataPoint {
    date: string
    value: number
    is_event: boolean
    event_name?: string
    description?: string
    references?: string[]
    event_value?: number | null
    nearby_event?: RealWorldDataPoint // Reference to an event if this point is near one
}
