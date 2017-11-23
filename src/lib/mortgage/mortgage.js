"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mortgage {
    constructor(initState) {
        this.state = initState;
    }
    get currentMonthsInterestPayment() {
        return this.remainingBalance * this.state.interestRate / (12 * 100);
    }
    currentMonthsPrincipalPayment(payment) {
        const monthPaidAgainstPrincipal = Math.min(payment - this.currentMonthsInterestPayment, this.remainingBalance);
        return monthPaidAgainstPrincipal;
    }
    get monthlyPayment() {
        var monthlyRate = this.state.interestRate / (12 * 100);
        var termMonths = this.state.termYears * 12;
        var mortgage = monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
        return this._round(this.state.loanAmount * mortgage);
    }
    get remainingBalance() {
        return this._round(this.state.loanAmount - this.state.paidAgainstPrincipal);
    }
    get totalSpent() {
        return this._round(this.state.paidAgainstPrincipal + this.state.interestPaid + this.state.closingCosts + this.state.downPayment);
    }
    makePayment(payment = this.monthlyPayment) {
        if (payment < this.monthlyPayment) {
            throw new Error(`The payment must be greater than ${this.monthlyPayment}`);
        }
        const breakdown = this.monthlyPaymentBreakdown(payment);
        this.state = this.copyState({
            paidAgainstPrincipal: this.state.paidAgainstPrincipal + this.currentMonthsPrincipalPayment(payment),
            interestPaid: this.state.interestPaid + this.currentMonthsInterestPayment
        });
        return breakdown;
    }
    monthlyPaymentBreakdown(payment = this.monthlyPayment) {
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
    forcastRemainingPayments(monthlyPayment = this.monthlyPayment) {
        const payments = [];
        let tempMortgage = Mortgage.create(this.state);
        while (tempMortgage.remainingBalance) {
            payments.push(tempMortgage.makePayment(monthlyPayment));
        }
        return payments;
    }
    copyState(partialState = {}) {
        return Object.assign({}, this.state, partialState);
    }
    _round(num) {
        return Math.ceil(num * 100) / 100;
    }
    static create(partialState) {
        const defaults = {
            closingCosts: 0,
            downPayment: 0,
            loanAmount: 100000,
            interestRate: 4.5,
            termYears: 30,
            interestPaid: 0,
            paidAgainstPrincipal: 0
        };
        return new Mortgage(Object.assign(defaults, partialState));
    }
}
exports.Mortgage = Mortgage;
const house1 = Mortgage.create({
    loanAmount: 300000,
    downPayment: 40000
});
console.log(house1.totalSpent, "total spent");
console.log(house1.monthlyPayment, "normal monthly payment");
console.log(house1.forcastRemainingPayments());
