contract('Kontract', function(accounts) {
  it("should run complete flow successfully", function() {
    var meta = Kontract.deployed();

    var expected_creator = accounts[1];  // truffle test use first user as a sender
    var expected_content = "test content";
    var expected_status = "DRAFT";
    var expected_ongoing_status = "ONGOING";
    var expected_completed_status = "COMPLETED";
    var expected_contractors = [accounts[0], accounts[1], accounts[2]];
    var expected_judgements = {};
    expected_judgements[accounts[0]] = "EMPTY";
    expected_judgements[accounts[1]] = "ACCEPT";
    expected_judgements[accounts[2]] = "EMPTY";

    var expect_accepted_judements = {};
    expect_accepted_judements[accounts[0]] = "ACCEPT";
    expect_accepted_judements[accounts[1]] = "ACCEPT";
    expect_accepted_judements[accounts[2]] = "ACCEPT";

    var expect_approved_judements = {};
    expect_approved_judements[accounts[0]] = "APPROVE";
    expect_approved_judements[accounts[1]] = "APPROVE";
    expect_approved_judements[accounts[2]] = "APPROVE";

    var expected_0contacts = 0;
    var expected_3contacts = 0;

    var lastest_created_kontract_id;

    return meta.getMyContracts.call({from: accounts[0], gas: 300000})
      .then(function (res) {
        expected_0contacts = JSON.parse(res);
        console.log("Account0 have " + expected_0contacts.length + " contacts.");
        return meta.getMyContracts.call({from: accounts[3]});
      })
      .then(function (res) {
        expected_3contacts = JSON.parse(res);
        console.log("Account3 have " + expected_3contacts.length + " contacts.");
        return meta.createContract(expected_content, expected_contractors, {from: expected_creator});
      })
      .then(function (res) {
        console.log("Account1 create new contact which have Account0, Account1, Account2 as contractors.");
        return meta.getMyContracts.call({from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        assert.equal(resObj.length, expected_0contacts.length + 1, "contact of 0 is invalid");
        expected_0contacts = resObj;
        console.log("Account0 have " + expected_0contacts.length + " contacts.");
        var recentContract = expected_0contacts[expected_0contacts.length - 1];
        lastest_created_kontract_id = parseInt(recentContract.id);
        return meta.getContract.call(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        console.log("Contect of new contract is ")
        console.log(resObj);
        assert.equal(resObj.creator, expected_creator, "creator is invalid");
        assert.equal(resObj.content, expected_content, "content is invalid");
        assert.equal(resObj.status, expected_status, "status is invalid");
        assert.deepEqual(resObj.contractors, expected_contractors, "contractors is invalid");
        assert.deepEqual(resObj.judgements, expected_judgements, "judgements is invalid");

        return meta.getMyContracts.call({from: accounts[3]});
      })
      .then(function (res) {
        var resArr = JSON.parse(res);
        console.log("Account3 have " + resArr.length + " contacts.");
        assert.deepEqual(resArr, expected_3contacts, "contacts of other account is changing");
        return meta.accept(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        console.log("Account2 signed the contact.");
        return meta.accept(lastest_created_kontract_id, {from: accounts[2]});
      })
      .then(function (res) {
        console.log("Account0 signed the contact.");
        return meta.getContract.call(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        console.log("Contect of new contract is ")
        console.log(resObj);
        assert.deepEqual(resObj.judgements, expect_accepted_judements, "judements accepted.")
        assert.equal(resObj.status, expected_ongoing_status, "status is invalid");
        return meta.approve(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        console.log("Account0 approved the contact.");
        return meta.approve(lastest_created_kontract_id, {from: accounts[1]});
      })
      .then(function (res) {
        console.log("Account1 approved the contact.");
        return meta.approve(lastest_created_kontract_id, {from: accounts[2]});
      })
      .then(function (res) {
        console.log("Account2 approved the contact.");
        return meta.getContract.call(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        console.log("Contect of new contract is ")
        console.log(resObj);
        assert.deepEqual(resObj.judgements, expect_approved_judements, "judements approved.")
        assert.equal(resObj.status, expected_completed_status, "status is invalid");
        return meta.sue(lastest_created_kontract_id, [accounts[1]], {from: accounts[2]});
      })
      .then(function (res) {
        console.log("Account2 sue Account1.");
        return meta.getContract.call(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        console.log("Contect of new contract is ")
        console.log(resObj);
        return meta.sue(lastest_created_kontract_id, [accounts[1]], {from: accounts[0]});
      })
      .then(function (res) {
        console.log("Account0 sue Account1.");
        return meta.getContract.call(lastest_created_kontract_id, {from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        console.log("Contect of new contract is ")
        console.log(resObj);
      })
  });
});
