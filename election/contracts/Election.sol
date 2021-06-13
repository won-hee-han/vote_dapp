pragma solidity >=0.4.22 <0.8.0;

contract Election {

    enum ProductCondition {New, Used}

      uint public productIndex;
//Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;

    }
//////

mapping (address => mapping(uint => Product)) stores;
mapping (uint => address) productIdInStore;

struct Product {

    uint id;
    string name;
    string candidateOne;
    string candidateTwo;
    uint startTime;
    uint endTime;
    ProductCondition condition;
    address adder;
    
    }
/////

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
        productIndex = 0;
    }
// add Election information



// add Candidate

 function addCandidate (string memory _name) private {
     candidatesCount ++;
     candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);

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
     
     
     // mapping 변수에서 candidate struct를 읽어와 후보자의 투표수를 증가시키는것.

     //trigger voted event
 }

 ///
function addProductToStore(string memory _name,
    string memory _candidateOne, string memory _candidateTwo, uint _startTime, uint _endTime,
    uint _productCondition) public {

        productIndex += 1;
        Product memory product = Product(productIndex, _name, _candidateOne, 
        _candidateTwo, _startTime, _endTime , ProductCondition(_productCondition), address(0));
    // 변수가 저장포인터로 저장됨. 컨트랙트 상태저장소, 임시값 메모리 컴파일러는
    // 구조체가 메모리인지 스토리지인지 확인함.
    // 구조체를 스토어에 추가하고 상품 ID를 추가한 사람의 이력을 확인하ㅣ.

    stores[msg.sender][productIndex] = product;
    productIdInStore[productIndex] = msg.sender;
    }

    function getProduct(uint _productId) public view returns (uint, string memory, string memory,
    string memory , uint, uint, ProductCondition, address) {

       Product memory product = stores[productIdInStore[_productId]][_productId];

      return (product.id, product.name, product.candidateOne, 
      product.candidateTwo, product.startTime, product.endTime, 
      product.condition, product.adder);

    } 
 ///

}


// Election.deployed().then(function(instance) { app = instance })
// 인스턴스 조회용 함수


