pragma solidity ^0.4.2;

contract Kontract {
  struct Kontract {
    address creator;
    string content;
    string status;
    address[] contractors;
    mapping(address => string) judgements;
  }

  Kontract[] kontracts;

  mapping(address => uint[]) kontractsByAddress;

  function createContract(string _content, address[] _contractors) returns (uint){
    var kontract = Kontract({
        creator: msg.sender,
        content: _content,
        status: "DRAFT",
        contractors: _contractors
      });
    kontracts.push(kontract);
    uint kontractId = kontracts.length - 1;
    for (uint i=0 ; i < _contractors.length ; i++) {
      kontracts[kontractId].judgements[_contractors[i]] = "EMPTY";
      kontractsByAddress[_contractors[i]].push(kontractId);
    }
    kontracts[kontractId].judgements[msg.sender] = "ACCEPT";
  }

  function accept(uint idx) {
    kontracts[idx].judgements[msg.sender] = "ACCEPT";
  }

  function reject(uint idx) {
    kontracts[idx].judgements[msg.sender] = "REJECT";
    kontracts[idx].status = "VOIDED";
  }

  function getContract(uint idx) returns (string) {
    return kontractToJson(idx);
  }

  function getMyContractsLength() returns (uint) {
    return kontractsByAddress[msg.sender].length;
  }

  function getMyContracts() returns (string) {
    string memory outJson = "[";
    var myContracts = kontractsByAddress[msg.sender];
    for (uint idx=0 ; idx < myContracts.length - 1 ; idx++) {
      outJson = strConcat(outJson, kontractToJson(idx), ",");
    }
    outJson = strConcat(outJson, kontractToJson(myContracts.length - 1));
    outJson = strConcat(outJson, "]");
    return outJson;
  }

  function kontractToJson(uint idx) returns(string){
    var kontract = kontracts[idx];
    string memory outJson = strConcat(outJson, '{"id": "', uintToString(idx), '", ');
    outJson = strConcat(outJson, '"creator": "', addressToString(kontract.creator), '", ');
    outJson = strConcat(outJson, '"content": "', kontract.content, '", ');
    outJson = strConcat(outJson, '"status": "', kontract.status, '"}');
    return outJson;
  }

  /* UTILITIES */

  function uintToBytes(uint v) constant returns (bytes32 ret) {
    if (v == 0) {
      ret = '0';
    }
    else {
      while (v > 0) {
        ret = bytes32(uint(ret) / (2 ** 8));
        ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
        v /= 10;
      }
    }
    return ret;
  }

  function bytes32ToString(bytes32 x) constant returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[charCount] = char;
            charCount++;
        }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
        bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }

  function uintToString(uint v) constant returns (string ret) {
    return bytes32ToString(uintToBytes(v));
  }

  function char(byte b) returns (byte c) {
      if (b < 10) return byte(uint8(b) + 0x30);
      else return byte(uint8(b) + 0x57);
  }

  function addressToString(address x) returns (string) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
        byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        byte hi = byte(uint8(b) / 16);
        byte lo = byte(uint8(b) - 16 * uint8(hi));
        s[2*i] = char(hi);
        s[2*i+1] = char(lo);
    }
    return strConcat("0x", string(s));
  }

  function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
  }

  function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
    return strConcat(_a, _b, _c, _d, "");
  }

  function strConcat(string _a, string _b, string _c) internal returns (string) {
    return strConcat(_a, _b, _c, "", "");
  }

  function strConcat(string _a, string _b) internal returns (string) {
    return strConcat(_a, _b, "", "", "");
  }

}
