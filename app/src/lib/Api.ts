export default class Api {

    static readonly ROUTE_BLOOD_TESTS = 'bloodtest'
    static readonly ROUTE_BG_READINGS = 'bgreadings'
    static readonly ROUTE_TREATMENTS = 'treatments'

    static async fetchData(url: string) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    static buildUrl(route: string, from?: Date, until?: Date) {
        const url = new URL(route, import.meta.env.VITE_API_URL)

        if (from) {
            url.searchParams.set('start', from.getTime().toString())
        }
        if (until) {
            url.searchParams.set('end', until.getTime().toString())
        }

        return url;
    }

    static async bloodtests(from?: Date, until?: Date): Promise<BloodTests> {
        return await this.fetchData(this.buildUrl(this.ROUTE_BLOOD_TESTS, from, until).toString())
    }

    static async bgreadings(from?: Date, until?: Date): Promise<BgReadings> {
        return await this.fetchData(this.buildUrl(this.ROUTE_BG_READINGS, from, until).toString())
    }

    static async treatments(from?: Date, until?: Date): Promise<Treatments> {
        return await this.fetchData(this.buildUrl(this.ROUTE_TREATMENTS, from, until).toString())
    }

}