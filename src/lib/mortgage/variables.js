"use strict";
// Potential expenses
// 1. Mortgage payment 
var mortgageAmount;
// 2. Mortgage interest rate
var mortgageInterest;
// 3. HOA
var homeOwnersAssociation = 0;
// 4. Insurance (dollars per year)
var homeInsurance = 1000;
// 5. Managing costs 8-10%
var managingCost = 0.09;
// 6. Property tax
var propertyTax;
// 7. Utilities
var utilities;
// 8 Garbage
var garbage;
// 9. Travel expenses to visit property
var travelExpenses;
// 10. DownPayment/closing costs
var initialPurchaseCost;
// 11. Initial renovations to make house rentable
var initialRenovations;
// Buckets to stash money in
// 1. Minor maintanence cost
var minorMaintanence;
// 2. Major maintenence/remodel
var majorMaintanence;
// 3. Vacancy rate
var vacancyRate;
// 4. Additional mortgage payment
var additionalMortgagePayment;
// Risks of owning rental
// 1. Economic downturn affecting local industry (high vacance/lower rent)
// 2. "Bad" tennant (repair costs higher for that unit/ not getting rent payments)
// 3. Disaster prone house (Higher chance of loss/ higher insurance price)
//
// Benefits of Owning Rental Property
// 1. Monthly rent
var monthlyRent;
