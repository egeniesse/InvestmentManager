import { MortgageState } from './mortgage.types';
import { generateId, round } from '../../shared/shared.method';

export class Mortgage {

  state: MortgageState;

  public static create(partialState: Partial<MortgageState>): Mortgage {
    const defaults: MortgageState = {
      id: generateId('Mortgage'),
      name: 'Rental 1',
      closingCosts: 5000,
      downPayment: 10,
      homeValue: 100000,
      interestRate: 4.5,
      termYears: 30,
      interestPaid: 0,
      paidAgainstPrincipal: 0,
      previousState: null,
      isDeleted: false,
      extraMonthlyPayment: 0
    };
    return new Mortgage(Object.assign(defaults, partialState));
  }

  constructor(initState: MortgageState) {
    this.state = initState;
  }

  get currentMonthsInterestPayment(): number {
    return this.remainingBalance * this.state.interestRate / (12 * 100);
  }

  currentMonthsPrincipalPayment(payment: number): number {
    return Math.min(payment - this.currentMonthsInterestPayment, this.remainingBalance);
  }

  get minimumMonthlyPayment(): number {
    const monthlyRate = this.state.interestRate / (12 * 100);
    const termMonths = this.state.termYears * 12;
    const mortgage = monthlyRate / (1 - Math.pow(1 + monthlyRate, - termMonths));
    return round(this.loanAmount * mortgage);
  }

  get monthlyPayment(): number {
    const payment = round(this.minimumMonthlyPayment + this.state.extraMonthlyPayment);
    const adjustedPayment = round(this.currentMonthsInterestPayment + this.currentMonthsPrincipalPayment(payment));
    return Math.min(payment, adjustedPayment);
  }

  get remainingBalance(): number {
    return round(this.loanAmount - this.state.paidAgainstPrincipal);
  }

  get interestPaid(): number {
    return round(this.state.interestPaid);
  }

  get paidAgainstPrincipal(): number {
    return round(this.state.paidAgainstPrincipal);
  }
  get totalSpent(): number {
    return round(
      this.state.paidAgainstPrincipal + this.state.interestPaid + this.state.closingCosts + this.downPaymentTotal
    );
  }

  get loanAmount(): number {
    return this.state.homeValue - this.downPaymentTotal;
  }

  get downPaymentTotal(): number {
    return round(this.state.homeValue * this.state.downPayment / 100);
  }

  makePayment(): Mortgage {
    const payment = this.monthlyPayment;
    this.copy({
      paidAgainstPrincipal: this.state.paidAgainstPrincipal + this.currentMonthsPrincipalPayment(payment),
      interestPaid: this.state.interestPaid + this.currentMonthsInterestPayment,
      previousState: this.state
    });
    return this;
  }

  get previousState(): Mortgage | null {
    if (this.state.previousState === null) {
      return null;
    }
    return Mortgage.create(this.state.previousState);
  }

  forcastRemainingPayments(): Mortgage {
    let tempMortgage: Mortgage = Mortgage.create(this.state);
    while (tempMortgage.remainingBalance > 0) {
      tempMortgage.makePayment();
    }
    return tempMortgage;
  }

  get pastStates(): Array<Mortgage> {
    let tempMortgage: Mortgage | null = Mortgage.create(this.state);
    const mortgages = [];
    while (tempMortgage) {
      mortgages.push(tempMortgage);
      tempMortgage = tempMortgage.previousState;
    }
    return mortgages.reverse();
  }

  copy(partialState: Partial<MortgageState> = {}): Mortgage {
    this.state = Object.assign({}, this.state, partialState);
    return this;
  }
}
