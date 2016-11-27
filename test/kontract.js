contract('Kontract', function(accounts) {
  it("should run complete flow successfully", function() {
    var meta = Kontract.deployed();

    var expected_creator = accounts[1];  // truffle test use first user as a sender
    var expected_content = "test content";
    var expected_status = "DRAFT";
    var expected_contractors = [accounts[0], accounts[1], accounts[2]];
    var expected_judgements = {};
    expected_judgements[accounts[0]] = "EMPTY";
    expected_judgements[accounts[1]] = "ACCEPT";
    expected_judgements[accounts[2]] = "EMPTY";

    var expected_0contacts = 0;
    var expected_3contacts = 0;

    return meta.getMyContracts.call({from: accounts[0], gas: 300000})
      .then(function (res) {
        expected_0contacts = JSON.parse(res);
        return meta.getMyContracts.call({from: accounts[3]});
      })
      .then(function (res) {
        expected_3contacts = JSON.parse(res);
        return meta.createContract(expected_content, expected_contractors, {from: expected_creator});
      })
      .then(function (res) {
        return meta.getMyContracts.call({from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);
        assert.equal(resObj.length, expected_0contacts.length + 1, "contact of 0 is invalid");
        expected_0contacts = resObj;
        return meta.getMyContracts.call({from: accounts[0]});
      })
      .then(function (res) {
        var resArr = JSON.parse(res);
        var recentContract = resArr[resArr.length - 1];
        var recentContractId = recentContract.id;
        return meta.getContract.call(recentContractId, {from: accounts[0]});
      })
      .then(function (res) {
        var resObj = JSON.parse(res);

        assert.equal(resObj.creator, expected_creator, "creator is invalid");
        assert.equal(resObj.content, expected_content, "content is invalid");
        assert.equal(resObj.status, expected_status, "status is invalid");
        assert.deepEqual(resObj.contractors, expected_contractors, "contractors is invalid");
        assert.deepEqual(resObj.judgements, expected_judgements, "judgements is invalid");

        return meta.getMyContracts.call({from: accounts[3]});
      })
      .then(function (res) {
        var resArr = JSON.parse(res);
        assert.deepEqual(resArr, expected_3contacts, "contacts of other account is changing");
      });
  });
});
