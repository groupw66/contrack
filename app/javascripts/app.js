var accounts;
var account;

function createContract() {
  var meta = Kontract.deployed();
  console.log(meta.address);
  var fromWallet = $("#walletSelect").val();
  console.log("selected wallet: " + $("#walletSelect").val());
  var contractors = JSON.parse($("#contractors").val());
  for (var i = 0; i < contractors.length; i++) {
    console.log("contractor" + i + ": " + contractors[i]);
  }
  var content = $("#content").val();

  meta.createContract(content, contractors, {from: fromWallet, gas: 300000})
  .then(function(value) {
    return meta.getMyContractsLength.call();
  })
  .then(function(res) {
    var contractsLength = parseInt(res);
    console.log(contractsLength);
    if (contractsLength > 0) {
      meta.getContract.call(contractsLength - 1).then(function(res){
        console.log(res);
      });
    }
  });
};

function generateWalletDropdownList() {
  for (var i=0; i < accounts.length; i++) {
    if (i == 0) {
      $("select").append('<option value="' + accounts[i] + '" selected>' + accounts[i] + '</option>');
    } else {
      $("select").append('<option value="' + accounts[i] + '">' + accounts[i] + '</option>');
    }
  }
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
    console.log(account);
    generateWalletDropdownList();
  });
}
