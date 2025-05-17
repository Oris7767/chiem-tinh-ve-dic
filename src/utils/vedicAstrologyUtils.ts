
import { DateTime } from 'luxon';

// Type for chart calculation parameters
export interface ChartParams {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Inspired by the VedAstro.Library.GeoLocation class
export class GeoLocation {
  private readonly _name: string;
  private readonly _longitude: number;
  private readonly _latitude: number;

  constructor(name: string, longitude: number, latitude: number) {
    this._name = name;
    
    // Auto-correct coordinates if needed (based on VedAstro implementation)
    if (this.isValidLatitudeLongitude(longitude, latitude)) {
      this._longitude = longitude;
      this._latitude = latitude;
    } else {
      this._longitude = this.correctDecimalPoint(longitude);
      this._latitude = this.correctDecimalPoint(latitude);
    }
  }

  public name(): string {
    return this._name;
  }

  public longitude(): number {
    return this._longitude;
  }

  public latitude(): number {
    return this._latitude;
  }

  public toString(): string {
    return `${this._name} ${this._longitude} ${this._latitude}`;
  }

  /**
   * Validates if the latitude and longitude are within valid ranges
   */
  private isValidLatitudeLongitude(longitude: number, latitude: number): boolean {
    if (latitude < -90 || latitude > 90) {
      console.warn(`Invalid Latitude: ${latitude}`);
      return false;
    }
    if (longitude < -180 || longitude > 180) {
      console.warn(`Invalid Longitude: ${longitude}`);
      return false;
    }
    return true;
  }

  /**
   * Attempts to correct decimal point placement in coordinates
   * Based on the VedAstro implementation
   */
  private correctDecimalPoint(input: number): number {
    // Convert the double to a string
    let inputStr = input.toString();
    
    // Check if the input is negative
    const isNegative = inputStr.startsWith("-");
    
    // Remove the negative sign if it exists
    if (isNegative) {
      inputStr = inputStr.substring(1);
    }
    
    // Calculate the position to insert the decimal point
    const insertPosition = inputStr.length > 7 ? inputStr.length - 7 : 0;
    
    // Insert the decimal point at the correct position
    inputStr = inputStr.insert(insertPosition, ".");
    
    // Convert the string back to a double
    let output = parseFloat(inputStr);
    
    // If the input was negative, make the output negative
    if (isNegative) {
      output = -output;
    }
    
    return output;
  }

  // Static helper for String prototype extension
  static {
    // Add insert method to String prototype if it doesn't exist
    if (!String.prototype.insert) {
      String.prototype.insert = function(index: number, string: string) {
        if (index > 0) {
          return this.substring(0, index) + string + this.substring(index);
        }
        return string + this;
      };
    }
  }

  // Static instances for common locations
  static Empty = new GeoLocation("Empty", 101, 4.59); // Ipoh
  static Tokyo = new GeoLocation("Tokyo, Japan", 139.83, 35.65);
  static Bangkok = new GeoLocation("Bangkok, Thailand", 100.50, 13.75);
  static Bangalore = new GeoLocation("Bangalore, India", 77.5946, 12.9716);
  static Ipoh = new GeoLocation("Ipoh, Malaysia", 101.0758, 4.6005);
  static HoChiMinh = new GeoLocation("Ho Chi Minh City, Vietnam", 106.6297, 10.8231);
  static Hanoi = new GeoLocation("Hanoi, Vietnam", 105.8342, 21.0278);
  static DaNang = new GeoLocation("Da Nang, Vietnam", 108.2022, 16.0544);
}

// String prototype extension interface
declare global {
  interface String {
    insert(index: number, string: string): string;
  }
}
