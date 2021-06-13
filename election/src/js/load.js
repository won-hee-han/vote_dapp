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
          var instance;
          var content = $("#main");
 
          // index.html의 loader와 content와 연결

          content.show();
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

         
          $("#add-item-to-store").submit(function(event) {
              const req = $("#add-item-to-store").serialize();
                let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g,'","').replace(/=/g,'":"') +
              '"}');
              let decodedParams = {}
              Object.keys(params).forEach(function(v){
                  decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
              });
             
              console.log(decodedParams); 
              App.saveProduct(decodedParams);
              event.preventDefault();  

          });
         App.renderStore();
      },

      saveProduct : function(product) {
          App.contracts.Election.deployed().then(function(f){
              return f.addProductToStore(product["product-name"], product["product-candidateOne"], product["product-candidateTwo"], 
              Date.parse(product["product-start-time"]) / 1000, Date.parse(product["product-end-time"]) / 1000,
              product["product-condition"], {from :  web3.eth.accounts[0], gas: 4700000});    
          }).then(function(f) {
              alert("성공적으로 등록되었습니다.");
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
              let node = $(".databox");
              node.append("<div class='voteData'>" +
                        "<div class='infoElection__title'> 투표 제목 : " + f[1] + "</div>" 
                        + "<div class='infoElection__title'> 1번 후보 : " + f[2] + "</div>" +
                         "<div class='infoElection__title'> 2번 후보 : " + f[3] + "</div>" +
                        "<div class='infoElection__title'> 투표 기간 " + f[4] + "~" + f[5] + "</div>" +
                        "<button class='vote__btn' ><a href='election.html'>투표 하기</a></button>" +  "</div>" );

             console.log(f);
          });
          
        }
        
  }


  
  $(function() {
      $(window).load(function() {
          App.init();
      });
  });

