contract('Kontract', function(accounts) {
  it("should create new contract", function() {
    var meta = Kontract.deployed();

    var expected_creator = accounts[0];  // truffle test use first user as a sender
    var expected_content = "test content";
    var expected_status = "DRAFT";
    var expected_contractors = [accounts[0], accounts[1]];
    var expected_judges = [accounts[0], accounts[1], accounts[2]];

    return meta.createContract(expected_content, expected_contractors, expected_judges)
      .then(function(id) {
        return meta.getContract.call(0).then(function (res) {
          var creator = res[0];
          var content = res[1];
          var status = res[2];
          var contractors = res[3];
          var judges = res[4];

          assert.equal(creator, expected_creator, "creator is invalid");
          assert.equal(content, expected_content, "content is invalid");
          assert.equal(status, expected_status, "status is invalid");
          assert.deepEqual(contractors, expected_contractors, "contractors is invalid");
          assert.deepEqual(judges, expected_judges, "judges is invalid");
        })
      })
  });
});
