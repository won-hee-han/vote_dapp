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
//Store accounts that have voted
mapping(address => bool) public voters;

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
   

 function vote (uint _candidateId) public {
     //require that they haven't voted before
     require(!voters[msg.sender], "이미 투표하셨습니다.");

     //require a valid candidate
     require(_candidateId > 0 && _candidateId <= candidatesCount, "There is no such candidate");

     // record that voter has voted
     voters[msg.sender] = true;
     //update candidate vote Count
     candidates[_candidateId].voteCount++; 
     // mapping 변수에서 candidate struct를 읽어와 후보자의 투표수를 증가시키는것.
 }

}


// Election.deployed().then(function(instance) { app = instance })
// 인스턴스 조회용 함수