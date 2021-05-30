pragma solidity >=0.4.22 <0.8.0;

contract Election {

//Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

// R/W Candidates
mapping(uint => Candidate) public candidates;
// key <-> value candidates array에 구조체의 값을 매핑.

// Store Candidates Count 
uint public candidatesCount;

 constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

// add Candidate

 function addCandidate (string memory _name) private {
     candidatesCount ++;
     candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);

     // Candidate(id = candidatesCount, name = _name, 0);
 }
   
}


// Election.deployed().then(function(instance) { app = instance })
// 인스턴스 조회용 함수ㅁ