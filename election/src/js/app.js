
  App = {

      web3Provider: null,
      contracts: {},
      account: '0x0',

      init: function() {
          return App.initWeb3();
      },

      initWeb3: function() {
          if (typeof web3 !== 'undefined') {
              // If a web instance is already provided by metamask.
              // 만약 웹 환경이 이미 메타마스크에 제공되고 있는 경우.
              App.web3Provider = web3.currentProvider;
              web3 = new Web3(web3.currentProvider);
          } else {
              // Spectify default instance if no web3 instance provided
              // 인스턴스가 실행되고 있지 않은 경우
              App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
              web3 = new Web3(App.web3Provider);
          }
          return App.initContract();
      },

      initContract: function() {
          $.getJSON("Election.json", function(election) {
              //$("_cmt" + seq)는document.all.("_cmt" + seq) 
              //Instantiate a new truffle contract from the artifact 
              //스마트계약 실행
              App.contracts.Election = TruffleContract(election);
              // Connect provider to interact with contract
              App.contracts.Election.setProvider(App.web3Provider);

              //    App.listenForEvents();
            
              return App.render();
          });
      },


      render: function() {
          var electionInstance;
          var container = $(".container");
          var loader = $("#loader");
          var content = $("#content");
 
          // index.html의 loader와 content와 연결
          
          container.show();
          loader.show();
          content.hide();
          // rendering되기 전까지 loader화면은 보이고, content화면은 숨김

          // Load account data
          web3.eth.getCoinbase(function(err, account) {
              if (err === null) {
                  App.account = account;
                  $("#accountAddress").html("현재 계정 : " + account);
                  // error가 없을 경우, html에 account주소를 표기
                  // 이더 계정을 연동
              }

          });



          // Load Contract data

          App.contracts.Election.deployed().then(function(instance) {
              electionInstance = instance;
              return electionInstance.candidatesCount();
          }).then(function(candidatesCount) {
              var candidatesResults = $("#candidatesResults");
              candidatesResults.empty();
              // candidatesResult를 index.html에 표시. 
              var candidatesSelect = $("#candidatesSelect");
              candidatesSelect.empty();
              for (var i = 1; i <= candidatesCount; i++) {

                  electionInstance.candidates(i).then(function(candidate) {
                      var id = candidate[0];
                      var name = candidate[1];
                      var voteCount = candidate[2];
                     
                      
                      // 후보자 수 만큼 electionInstance에 후보자 데이터를 저장
                      // Render candidate Result
                      var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>"  + voteCount + "</td></tr>"
                      candidatesResults.append(candidateTemplate);
                      // 후보자 템플릿에 id, name, votecount를 추가

                      // Render Candidate ballot option
                      var candidateOption = "<option value='" + id + "' >" + name + "</option>"
                      candidatesSelect.append(candidateOption);
                      
                      //Render candidate Result total
                  });
              }
              return electionInstance.voters(App.account);
          }).then(function(hasVoted) {
              //Do not allow a user to Vote
              if (hasVoted) {
                  $('form').hide();
                  
                  // 투표를 한 경우 폼을 삭제합니다.
              }

              loader.hide();
              content.show();
              var day = new Date();
              var hour = day.getHours();
              var minute = day.getMinutes();
              loader.hide();
              content.show();
              if(hour>20 && minute>36){
                content.hide();
              }
              // 21시 36분 이후로 숨김 
          }).catch(function(error) {
              console.warn(error);
          });
      },


              }
              // 21시 36분 이후로 숨김 
      /*
            // Listen for events emitted from the contract
            listenForEvents: function() {
                App.contracts.Election.deployed().then(function(instance) {
                    // Restart Chrome if you are unable to receive this event
                    // This is a known issue with Metamask

                    instance.votedEvent({}, {
                        fromBlock: 0,
                        toBlock: 'latest'
                    }).watch(function(error, event) {
                        console.log("event triggered", event);
                        // Reload when a new vote is recorded
                        App.render();
                    })
                })
            },
    */
        

      castVote: function() {
          var candidateId = $('#candidatesSelect').val();
          App.contracts.Election.deployed().then(function(instance) {
              return instance.vote(candidateId, { from: App.account });
          }).then(function(result) {
              // Wait for votes to update
              alert("투표가 완료되었습니다");
              $("#content").hide();
              $("#loader").show();

          }).catch(function(err) {
              console.error(err);
          });
      },


      renderStore : function() {
          //Get the Product Count
          // Loop through and fetch all products by Id
           var instance;
          return App.contracts.Election.deployed().then(function(instance){
              return instance.productIndex.call();             
          }).then(function(count) {
             for(var i=1; i<=count; i++) {
                  App.renderProduct(instance, i);
              }
          });
        },

        renderProduct : function(instance, index) {
            App.contracts.Election.deployed().then(function(instance) {
              return instance.getProduct.call(index);
            }).then(function(f){
              let node = $("#electionName");
              node.append(f[1]);
           
          });
          
        }



  }

  $(function() {
      $(window).load(function() {
          App.init();
       
      });
  });

