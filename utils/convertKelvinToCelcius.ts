/** @format */

export function convertKelvinToCelcius(tempInKelvin: number): number {
    const tempInCelsius = tempInKelvin - 273.15;
    return Math.floor(tempInCelsius); // Removes Decimal part and keeps integer part
}