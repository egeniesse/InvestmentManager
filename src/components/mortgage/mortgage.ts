import { MortgageState, MonthlyPaymentBreakdown } from './mortgage.types';

export class Mortgage {

  state: MortgageState;
  constructor(initState: MortgageState) {
    this.state = initState;
  }

  get currentMonthsInterestPayment(): number {
    return this.remainingBalance * this.state.interestRate / (12 * 100);
  }

  currentMonthsPrincipalPayment(payment: number): number {
    const monthPaidAgainstPrincipal = Math.min(payment - this.currentMonthsInterestPayment, this.remainingBalance);
    return monthPaidAgainstPrincipal;
  }

  get monthlyPayment(): number {
    var monthlyRate = this.state.interestRate / (12 * 100);
    var termMonths = this.state.termYears * 12;
    var mortgage = monthlyRate / (1 - Math.pow(1 + monthlyRate, - termMonths));
    return this._round(this.state.loanAmount * mortgage);
  }

  get remainingBalance(): number {
    return this._round(this.state.loanAmount - this.state.paidAgainstPrincipal);
  }

  get totalSpent(): number {
    return this._round(this.state.paidAgainstPrincipal + this.state.interestPaid + this.state.closingCosts + this.state.downPayment);
  }

  makePayment(payment: number = this.monthlyPayment): MonthlyPaymentBreakdown {
    if (payment < this.monthlyPayment) {
      throw new Error(`The payment must be greater than ${this.monthlyPayment}`)
    }
    const breakdown = this.monthlyPaymentBreakdown(payment);
    this.copy({
      paidAgainstPrincipal: this.state.paidAgainstPrincipal + this.currentMonthsPrincipalPayment(payment),
      interestPaid: this.state.interestPaid + this.currentMonthsInterestPayment
    });
    return breakdown;
  }
  
  monthlyPaymentBreakdown(payment: number = this.monthlyPayment): MonthlyPaymentBreakdown {
    const monthPaidAgainstPrincipal = this.currentMonthsPrincipalPayment(payment);
    const monthInterestPaid = this.currentMonthsInterestPayment;
    return {
      monthPaidAgainstPrincipal: this._round(monthPaidAgainstPrincipal),
      monthInterestPaid: this._round(monthInterestPaid),
      totalPaidAgainstPrincipal: this._round(this.state.paidAgainstPrincipal + monthPaidAgainstPrincipal),
      totalInterestPaid: this._round(this.state.interestPaid + monthInterestPaid),
      balanceRemaining: this._round(this.remainingBalance - monthPaidAgainstPrincipal)
    };
  }

  forcastRemainingPayments(monthlyPayment: number = this.monthlyPayment): Array<MonthlyPaymentBreakdown> {
    const payments: Array<MonthlyPaymentBreakdown> = [];
    let tempMortgage: Mortgage = Mortgage.create(this.state);
    while (tempMortgage.remainingBalance) {
      payments.push(tempMortgage.makePayment(monthlyPayment));
    }
    return payments;
  } 

  copy(partialState: Partial<MortgageState> = {}): Mortgage {
    this.state = Object.assign({}, this.state, partialState);
    return this;
  }
  
  private _round(num: number): number {
    return Math.ceil(num * 100) / 100;
  }

  static create(partialState: Partial<MortgageState>): Mortgage {
    const defaults: MortgageState = {
      id: '1',
      name: 'Rental 1',
      closingCosts: 5000,
      downPayment: 20000,
      loanAmount: 100000,
      interestRate: 4.5,
      termYears: 30,
      interestPaid: 0,
      paidAgainstPrincipal: 0,
      isDeleted: false
    }
    return new Mortgage(Object.assign(defaults, partialState));
  }
}
