import { Mortgage } from '../mortgage/mortgage.model';
import { Property } from './property.model';

export interface PropertyState {
  id: string;
  propertyValue: number;
  mortgageIds: Array<string>;
  monthlyRent: number;
  managementFees: number;
  vacancyLoss: number;
  minorRepairWithholding: number;
  majorRemodelWithholding: number;
  extraMonthlyPayment: number;
  propertyTaxRate: number;
  utilities: number;
  insurance: number;
}

export interface PropertySimulatorState {
  property: Property;
  mortgages: Array<Mortgage>;
  years: number;
  granularity: number;
  percentRentIncrease: number;
  percentEquityIncrease: number;
}

export const COPY_PROPERTY = 'COPY_PROPERTY';
export type COPY_PROPERTY = typeof COPY_PROPERTY;

export type InitPropertyRequest = {
  type: COPY_PROPERTY,
  payload: PropertyState
};

export type PropertyAction = COPY_PROPERTY;
export type PropertyRequest = InitPropertyRequest;

export type PropertiesById = { [propertyId: string]: PropertyState };
