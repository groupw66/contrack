contract('Kontract', function(accounts) {
  it("should create new contract", function() {
    var meta = Kontract.deployed();

    var expected_creator = accounts[0];  // truffle test use first user as a sender
    var expected_content = "test content";
    var expected_status = "DRAFT";
    var expected_contractors = [accounts[0], accounts[1]];
    var expected_judgements = {};
    expected_judgements[accounts[0]] = "ACCEPT";
    expected_judgements[accounts[1]] = "EMPTY";

    var expectedMyContractsLength = 0;

    return meta.getMyContractsLength.call()
      .then(function (res) {
        expectedMyContractsLength = parseInt(res);
        return meta.createContract(expected_content, expected_contractors);
      })
      .then(function (tx_id) {
        return meta.getMyContractsLength.call();
      })
      .then(function (res) {
        assert.equal(res, expectedMyContractsLength + 1, "myContractsLength is invalid");
        return meta.getContract.call(0);
      })
      .then(function (res) {
        console.log("getContract: " + res);
        var resObj = JSON.parse(res);

        assert.equal(resObj.creator, expected_creator, "creator is invalid");
        assert.equal(resObj.content, expected_content, "content is invalid");
        assert.equal(resObj.status, expected_status, "status is invalid");
        assert.deepEqual(resObj.contractors, expected_contractors, "contractors is invalid");
        assert.deepEqual(resObj.judgements, expected_judgements, "judgements is invalid");
      })
  });
});
