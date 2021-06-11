pragma solidity >=0.4.22 <0.8.0;

contract Election {

//Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        uint totalVote;
    }
    struct SetCandidate {
        address voter;
        uint placeBlockNumber;
    }

// R/W Candidates
mapping(uint => Candidate) public candidates;
// key <-> value candidates array에 구조체의 값을 매핑.
//Store accounts that have voted
mapping(address => bool) public voters;

// event Voted 투표후 페이지를 리프레시

event votedEvent (
    uint indexed _candidateId
);

// Store Candidates Count 
uint public candidatesCount;


 constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

// add Candidate

 function addCandidate (string memory _name) private {
     candidatesCount ++;
     candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, 0);

     // Candidate(id = candidatesCount, name = _name, 0);
 }

// 투표자의 중복투표 확인용 함수.
 function vote (uint _candidateId) public {
     //require that they haven't voted before
     require(!voters[msg.sender],"This Voter has already voted.");

     //require a valid candidate
     require(_candidateId > 0 && _candidateId <= candidatesCount, "There is no such candidate");

     // record that voter has voted
     voters[msg.sender] = true;

     //update candidate vote Count
     candidates[_candidateId].voteCount++;
     candidates[1].totalVote++;
     
     

    
     // mapping 변수에서 candidate struct를 읽어와 후보자의 투표수를 증가시키는것.

     //trigger voted event

     emit votedEvent(_candidateId);
 }

}


// Election.deployed().then(function(instance) { app = instance })
// 인스턴스 조회용 함수


