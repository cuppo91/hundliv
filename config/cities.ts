export type CityConfig = {
  id: string
  name: string
  domain: string
  center: [number, number] // [lng, lat]
  zoom: number
  googlePlacesLocation: string
}

const cities: Record<string, CityConfig> = {
  malmo: {
    id: 'malmo',
    name: 'Malmö',
    domain: 'hundlivmalmo.se',
    center: [13.0038, 55.6050],
    zoom: 12,
    googlePlacesLocation: 'Malmö, Sweden',
  },
  goteborg: {
    id: 'goteborg',
    name: 'Göteborg',
    domain: 'hundlivgoteborg.se',
    center: [11.9746, 57.7089],
    zoom: 12,
    googlePlacesLocation: 'Gothenburg, Sweden',
  },
  stockholm: {
    id: 'stockholm',
    name: 'Stockholm',
    domain: 'hundlivstockholm.se',
    center: [18.0686, 59.3293],
    zoom: 12,
    googlePlacesLocation: 'Stockholm, Sweden',
  },
}

export function getCityConfig(): CityConfig {
  const cityId = process.env.NEXT_PUBLIC_CITY_ID
  if (!cityId || !cities[cityId]) {
    return cities.malmo // fallback for local dev
  }
  return cities[cityId]
}

export default cities
