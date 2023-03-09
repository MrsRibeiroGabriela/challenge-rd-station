module.exports = (customerSuccess, customers, customerSuccessAway) => {
  const customerSuccessOrderedByScore = customerSuccess.sort(
    (a, b) => a.score - b.score
  );

  const customersOrderedByScore = customers.sort((a, b) => a.score - b.score);

  const customerSuccessAvailable = customerSuccessOrderedByScore.filter(
    (item) => !customerSuccessAway.includes(item.id)
  );

  const totalCustomer = (cs) => cs.customers.length;

  const customerSuccessWithCustomers = customerSuccessAvailable.map((cs) => {
    cs.customers = [];
    return cs;
  });

  let customerSuccessIndex = 0;
  customersOrderedByScore.forEach((customer) => {
    const matchScore = (customer, cs) => customer.score <= cs.score;
    const addCustomerToCs = (customer, cs) => cs.customers.push(customer);

    let cs = customerSuccessWithCustomers[customerSuccessIndex];
    let isMatched = matchScore(customer, cs);

    if (isMatched) addCustomerToCs(customer, cs);

    while (!isMatched) {
      const isLastCs =
        customerSuccessWithCustomers[customerSuccessWithCustomers.length - 1] === cs;

      if (isLastCs) break;

      customerSuccessIndex++;
      cs = customerSuccessWithCustomers[customerSuccessIndex];
      isMatched = matchScore(customer, cs);
      if (isMatched) addCustomerToCs(customer, cs);
    }
  });

  const csWithMostCustomers = customerSuccessWithCustomers.reduce((acc, current) => {
    const currentCustomersLength = totalCustomer(current);
    const overloadedCustomersLength = totalCustomer(acc);
    return currentCustomersLength > overloadedCustomersLength ? current : acc;
  }, customerSuccessWithCustomers[0]);

  const isADrawCustomerSuccess = customerSuccessWithCustomers.some(
    ({ id, customers }) => {
      const equalCustomerSuccess = id === csWithMostCustomers.id;
      const equalNumberOfCustomers = totalCustomer(csWithMostCustomers) === customers.length;
      return !equalCustomerSuccess && equalNumberOfCustomers;
    }
  );

  return isADrawCustomerSuccess ? 0 : csWithMostCustomers.id;
};
