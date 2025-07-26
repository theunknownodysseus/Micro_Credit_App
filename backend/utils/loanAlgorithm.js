// Advanced Loan Eligibility Algorithm
const calculateLoanEligibility = (userData, requestedAmount, requestedTenure) => {
    const {
        currentSalary,
        previousSalary,
        currentEMIs,
        rentAmount,
        groceryExpense,
        mallVisitsPerMonth,
        averageMallSpending,
        diningOutFrequency,
        averageDiningExpense,
        travelFrequency,
        averageTravelExpense,
        creditCardUtilization,
        creditCardLimit,
        savingsAmount,
        investmentAmount,
        dependents,
        educationLoan,
        vehicleLoan,
        workExperience,
        jobStability,
        ownsHouse
    } = userData;

    // 1. Income Stability Score (25% weightage)
    const salaryGrowth = previousSalary > 0 ? ((currentSalary - previousSalary) / previousSalary) * 100 : 0;
    const incomeStabilityScore = Math.min(100, Math.max(0,
        (workExperience * 10) +
        (salaryGrowth * 5) +
        (jobStability === 'Stable' ? 30 : jobStability === 'Moderate' ? 15 : 0)
    ));

    // 2. Expense Analysis Score (20% weightage)
    const totalMonthlyExpenses =
        currentEMIs +
        rentAmount +
        groceryExpense +
        (mallVisitsPerMonth * averageMallSpending) +
        (diningOutFrequency * averageDiningExpense) +
        (travelFrequency * averageTravelExpense / 12);

    const expenseRatio = (totalMonthlyExpenses / currentSalary) * 100;
    const expenseScore = Math.max(0, 100 - expenseRatio);

    // 3. Debt-to-Income Ratio Score (20% weightage)
    const totalDebt = currentEMIs + educationLoan + vehicleLoan + (creditCardUtilization * creditCardLimit / 100);
    const debtToIncomeRatio = (totalDebt / currentSalary) * 100;
    const debtScore = Math.max(0, 100 - (debtToIncomeRatio * 2));

    // 4. Savings & Investment Score (15% weightage)
    const savingsRatio = ((savingsAmount + investmentAmount) / currentSalary) * 100;
    const savingsScore = Math.min(100, savingsRatio * 2);

    // 5. Lifestyle Score (10% weightage)
    const monthlyLifestyleExpense =
        (mallVisitsPerMonth * averageMallSpending) +
        (diningOutFrequency * averageDiningExpense) +
        (travelFrequency * averageTravelExpense / 12);

    const lifestyleRatio = (monthlyLifestyleExpense / currentSalary) * 100;
    const lifestyleScore = Math.max(0, 100 - (lifestyleRatio * 3));

    // 6. Employment & Housing Score (10% weightage)
    const employmentScore =
        (workExperience >= 2 ? 30 : workExperience * 15) +
        (ownsHouse ? 40 : 20) +
        (dependents <= 2 ? 30 : Math.max(0, 30 - (dependents * 5)));

    // Final Weighted Score
    const finalScore = (
        (incomeStabilityScore * 0.25) +
        (expenseScore * 0.20) +
        (debtScore * 0.20) +
        (savingsScore * 0.15) +
        (lifestyleScore * 0.10) +
        (employmentScore * 0.10)
    );

    // Risk Assessment
    let riskCategory = 'High Risk';
    let maxLoanAmount = 0;
    let maxTenure = 12;
    let interestRate = 18;

    if (finalScore >= 80) {
        riskCategory = 'Low Risk';
        maxLoanAmount = currentSalary * 8;
        maxTenure = 36;
        interestRate = 10;
    } else if (finalScore >= 60) {
        riskCategory = 'Medium Risk';
        maxLoanAmount = currentSalary * 5;
        maxTenure = 24;
        interestRate = 14;
    } else if (finalScore >= 40) {
        riskCategory = 'High Risk';
        maxLoanAmount = currentSalary * 2;
        maxTenure = 12;
        interestRate = 18;
    }

    // EMI Calculation
    const monthlyInterestRate = interestRate / (12 * 100);
    const approvedAmount = Math.min(requestedAmount, maxLoanAmount);
    const approvedTenure = Math.min(requestedTenure, maxTenure);

    const emi = approvedAmount > 0 ?
        (approvedAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, approvedTenure)) /
        (Math.pow(1 + monthlyInterestRate, approvedTenure) - 1) : 0;

    // Eligibility Check
    const netIncome = currentSalary - totalMonthlyExpenses;
    const isEligible = finalScore >= 40 && emi <= (netIncome * 0.4) && approvedAmount >= 10000;

    return {
        isEligible,
        approvedAmount: isEligible ? Math.round(approvedAmount) : 0,
        approvedTenure: isEligible ? approvedTenure : 0,
        emi: isEligible ? Math.round(emi) : 0,
        interestRate,
        riskScore: Math.round(finalScore),
        riskCategory,
        creditScore: Math.round(finalScore * 8.5), // Convert to credit score scale
        eligibilityReason: isEligible ?
            `Approved based on strong financial profile (Score: ${Math.round(finalScore)})` :
            `Rejected due to ${finalScore < 40 ? 'low credit score' : 'insufficient repayment capacity'}`,
        algorithmDetails: {
            incomeStability: Math.round(incomeStabilityScore),
            expenseRatio: Math.round(expenseRatio),
            debtToIncomeRatio: Math.round(debtToIncomeRatio),
            savingsRatio: Math.round(savingsRatio),
            lifestyleScore: Math.round(lifestyleScore),
            employmentScore: Math.round(employmentScore),
            finalScore: Math.round(finalScore)
        }
    };
};

module.exports = { calculateLoanEligibility };