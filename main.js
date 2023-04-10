function getQuestions(){
    let myRequst = new XMLHttpRequest();
    myRequst.onreadystatechange=function(){
        if (this.readyState===4 && this.status===200){
            console.log(this.responseText);
        }
    };
    myRequst.open("GET","Questions.json", true);
    myRequst.send();
}

getQuestions();