//select elements 
let countSpan= document.querySelector(".quiz-info .count span");
let bulletsSpanContainer= document.querySelector(".bullets .spans");
let quizArea=document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let the_bullets=document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdowenElement=document.querySelector(".bullets .countdowen");
let currentIndexForQuestion=0
let rightAnswers=0
let countdowenInterval;



function getQuestions(){
    let myRequst = new XMLHttpRequest();
    myRequst.onreadystatechange=function(){
        if (this.readyState===4 && this.status===200){

            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            createBullets(questionsCount);
            addQuestionData(questionsObject[currentIndexForQuestion],questionsCount);
            countdowen( 100 , questionsCount)

            submitButton.onclick = function(){ 
               
                let theRightAnswer = questionsObject[currentIndexForQuestion]["right_answer"];
                currentIndexForQuestion++;
                checkAnswer(theRightAnswer,questionsCount);
                quizArea.innerHTML="";
                answersArea.innerHTML="";

                addQuestionData(questionsObject[currentIndexForQuestion],questionsCount);

                handleBullets();
                
                clearInterval(countdowenInterval);
                countdowen(100,questionsCount);


                showResults(questionsCount);
            
  

            }
        
        
        }
    };
    myRequst.open("GET","Questions.json", true);
    myRequst.send();
}

getQuestions();

function createBullets(num){
    countSpan.innerHTML=num;

    for(let i =0 ; i<num;i++){
        let theBullet = document.createElement("span");
        if(i===0){
            theBullet.className="on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }

}

function addQuestionData(obj,count){
    if (currentIndexForQuestion < count){
     let questionTitle = document.createElement("h2");
     let questionText = document.createTextNode(obj["title"]);

     questionTitle.appendChild(questionText);

     quizArea.appendChild(questionTitle);

      for(let i = 1 ; i<=4 ;i++){

        let mainDiv=document.createElement("div");
        mainDiv.className="answer";

        let radioInput=document.createElement("input");

        radioInput.name='question';
        radioInput.type='radio';
        radioInput.id='answer_'+i;
        radioInput.dataset.answer=obj['answer_'+i];

         if(i===1){
            radioInput.checked=true;
         }


        let theLabel = document.createElement("label");

        theLabel.htmlFor= 'answer_'+i;
        
        let theLabelText = document.createTextNode(obj["answer_"+i]);
        theLabel.appendChild(theLabelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answersArea.appendChild(mainDiv);

     }
    }


}

function checkAnswer(rightAnswer,count){

    let theChoosenAnswer;
    let the_answers=document.getElementsByName("question");
    for (let i = 0 ; i < the_answers.length ; i++){
        if (the_answers[i].checked===true){
            theChoosenAnswer= the_answers[i].dataset.answer;
        }
   }

   if(rightAnswer===theChoosenAnswer){
    rightAnswers++;
    console.log("good job");
   }

}

function handleBullets(){
    let bulletsSpans=document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans= Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndexForQuestion===index){
            span.className='on';
        }
    })

}

function showResults(count){
    let theResults;
    if(currentIndexForQuestion===count){
        the_bullets.remove();
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();

        if(rightAnswers>(count/2) && rightAnswers<count){
            theResults='<span class="good">Good</span>, '+rightAnswers+' from '+count+
            '<button class="reload" onclick="location.reload()">Take the quize one more time </button>';
        }else if (rightAnswers===count){
            theResults='<span class="perfect">Perfect</span>, All Answer is Correct'+
            '<button class="reload" onclick="location.reload()">Take the quize one more time </button>';
        }else{
            theResults='<span class="bad">Bad</span>, '+rightAnswers+' from '+count+
            '<button class="reload" onclick="location.reload()">Take the quize one more time </button>';
        }

        resultsContainer.innerHTML=theResults;
        resultsContainer.style.padding='10px';
        resultsContainer.style.backgroundcolor='white';
        resultsContainer.style.marginTop='10px';

        
    }
}

function countdowen(duration,count){
    
    if(currentIndexForQuestion<count){
        let minutes,seconds;
        countdowenInterval=setInterval(function(){
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);

            minutes=minutes < 10? '0' + minutes : minutes;
            seconds=seconds < 10? '0' + seconds : seconds;

            

            countdowenElement.innerHTML = minutes+ ":"+ seconds;
            if(--duration<0){
                clearInterval(countdowenInterval);
                submitButton.click();
               
            }

        },1000)

    }
}