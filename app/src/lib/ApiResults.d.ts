interface BloodTest {
    _id: number;
    created_timestamp: number;
    mgdl: number;
    source: string;
    state: number;
    timestamp: number;
    uuid: string;
}

interface BloodTests {
    items: BloodTest[];
}

interface BgReading {
    _id: number;
    a: number;
    age_adjusted_raw_value: number;
    b: number;
    c: number;
    calculated_value: number;
    calculated_value_slope: number;
    calibration: number;
    calibration_flag: number;
    calibration_uuid: string;
    dg_delta_name: string;
    dg_mgdl: number;
    dg_slope: number;
    filtered_calculated_value: number;
    filtered_data: number;
    hide_slope: number;
    synced: number;
    noise: any;
    ra: number;
    raw_calculated: number;
    raw_data: number;
    rb: number;
    rc: number;
    sensor: number;
    sensor_uuid: string;
    source_info: string;
    time_since_sensor_started: number;
    timestamp: number;
    uuid: string;
}

interface BgReadings {
    items: BgReading[];
}

interface Treatment {
    _id: number;
    carbs: number;
    created_at: string;
    enteredBy: string;
    eventType: string;
    insulin: number;
    insulinJSON: string;
    notes: string | null;
    timestamp: number;
    uuid: string;
}

interface Treatments {
    items: Treatment[];
}

interface ApiResults {
    bloodTests: BloodTests
    bgReadings: BgReadings
    treatments: Treatments
}