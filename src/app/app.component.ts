import { Component, HostListener } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { response } from 'express';
import { Observable } from 'rxjs';
import { type } from 'os';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-tour-of-heroes';
  key = "";
  selectedTarget:any; // select target when we click a block 
  rows: string[] = ["08:30","09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","20:30","21:30","22:30","23:30","24:30",];
  lastObject: any; // last clicked block
  posts: any;
  
  constructor(private http:HttpClient) { } // constructor for HttpClient

  // when we write something with keyboard write it to block
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(this.selectedTarget != null)
    {
      if(event.key == "Enter")
        this.selectedTarget.innerHTML += "<br>";
      else
        this.selectedTarget.innerHTML += event.key;
    }
  }

  // delete button is pressed so delete everything
  @HostListener('document:keydown.delete', ['$event'])
  onDeleteComponent(event: KeyboardEvent) {
    if(this.selectedTarget != null)
      this.selectedTarget.innerHTML = "";
  }

    // backSpace button is pressed so delete letter

  @HostListener('document:keydown.backspace', ['$event'])
  onBackSpaceComponent(event: KeyboardEvent) {
    if(this.selectedTarget != null)
      this.selectedTarget.innerHTML = this.selectedTarget.innerHTML.slice(0,-1)
  }

    // when we click a block  make it's colour to blue when we click another block make it colour red
  tdClicked(event:any){
    if(event.target.getAttribute("selected") == "0")
    {
      if(this.selectedTarget != null)
        this.selectedTarget.style.backgroundColor = "red"
      this.selectedTarget = event.target;
      event.target.setAttribute("selected","1")
      event.target.style.backgroundColor = "blue"
      this.lastObject = event.target;

    }
    else
    {
      if(this.selectedTarget == event.target)
      {
        this.selectedTarget = null;
        event.target.innerHTML = ""
        event.target.setAttribute("selected","0")
        event.target.style.backgroundColor = "var(--bs-table-bg)"
        this.lastObject = null;
      }
      else
      {
        if(this.selectedTarget != null)
          this.selectedTarget.style.backgroundColor = "red"
        this.selectedTarget = event.target;
        event.target.style.backgroundColor = "blue"
        this.lastObject = event.target;

      }
    } 

  }


  // when we click I'm Bored button this method is called. Get random event suggestion from boredapi.
  tdClickedBored(event:any)
  {
    if(this.lastObject === null) return;
    this.posts =  this.http.get('https://www.boredapi.com/api/activity/').subscribe((response)=>{
      let resSTR = JSON.stringify(response);
      let resJSON = JSON.parse(resSTR);
      console.log(resJSON);
      {      this.lastObject.innerHTML = resJSON.activity; }

    },(error)=>{
        console.log("error");
    }
    
    );
    
   
  }



  client_ID = 'MjY1MTMzMTN8MTY0OTcwMTk0Ni4zMTY1MTU3' // client id for seat geek
  eventIndex = 0;


  // When Suggest Me Event button is clicked this method is called. If we click a block from wednesday this method will suggest a event from closest wednesday.
  tdClickedEvent(event:any){
    if(this.lastObject === null) return;
   
    
    this.posts =  this.http.get('https://api.seatgeek.com/2/events?datetime_utc.gt=' +  this.nextAvalaibleDay(this.lastObject.getAttribute("id")) + '&client_id=' + this.client_ID
     ).subscribe((response)=>{
      let resSTR = JSON.stringify(response);
      let resJSON = JSON.parse(resSTR);
      console.log(resJSON);
      {     
        
         this.lastObject.innerHTML = 'event: ' + resJSON.events[this.eventIndex].type  + "<br />" +' time: '  + this.correctDay(resJSON.events[this.eventIndex].datetime_utc) +
         "<br />"  +'location:' + resJSON.events[this.eventIndex].venue.name;
      }

    },(error)=>{
        console.log("error");
    }
    
    );
    
  }
  

  // find next choosen day date. For instance if we choose Monday from table this function return next Monday date.
  // since there is no avalaible event every hours there is no check for hours.
  nextAvalaibleDay( dayValue : number) 
  {
      var today = new Date();
      var todayN = today.getDay();
      var offset = 0;
      if(dayValue > todayN){
          offset = dayValue - todayN;
      }else{
        offset =  7 - (todayN - dayValue );
      }
      //var offset = (todayN < 3 ? 3 : 10) - todayN; // <--- the most important part
      today.setDate(today.getDate() + offset + 1);
      var neededDay =  today.getFullYear().toString() + '-';
      var month = today.getMonth() +1;
      if(month< 10){
        neededDay = neededDay + '0' + month + '-';
      } 
      else{
        neededDay = neededDay + month + '-';
      }

      if(today.getDate() < 10){
          neededDay = neededDay + '0' +  today.getDate();
      }
      else{
        neededDay = neededDay + today.getDate();

      }
     
      return neededDay; 
  }


  correctDay(day : string){
    var realDay ='';
    for (var i = 0; i < day.length; i++) {
      if(day[i] ==='T'){
        return realDay;
      }
      realDay +=day[i];
    }
    return realDay;
  }

  findIndex(index : number){
     var realIndex = dayEventIndex.get(index) ;
     dayEventIndex.set(index,realIndex+1)
     realIndex += 1;
     return realIndex;
  }

  // When we click Give Meal Suggestion button this function is called. This function is suggestin meal names for cooking.
  tdGiveMealSuggestion(event:any){
    if(this.lastObject === null) return;
    this.posts =  this.http.get('https://www.themealdb.com/api/json/v1/1/random.php').subscribe((response)=>{
      let resSTR = JSON.stringify(response);
      let resJSON = JSON.parse(resSTR);

      
      {      this.lastObject.innerHTML ='Cook: ' + resJSON['meals'][0].strMeal; }

    },(error)=>{
        console.log("error");
    }
    
    );

  }



 private readonly clientId = '91e673093145911'; // clientID for imgurApi
 
  


  //When Save Schedule method is clicked this method is called. This method is taking screen shot of the web page with usage of html2canvas.
  // I try to upload images to Imgur Api but I alway take status 429 error(Imgur is temporarily over capacity. Please try again later) and I can not handle with this error.
  // In fact I can take screen shot correctly but I can not post it.
  async  tdSaveSchedule(event:any){
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Client-ID ${this.clientId}`
      }),
    };
    html2canvas(document.getElementById('Schedule')!).then((canvas) => {
        var base64Canvas = canvas.toDataURL().replace(/.*,/, '');
        this.http.post('https://api.imgur.com/3/image', base64Canvas , httpOptions).subscribe((response)=>{
          console.log(response);
        }

 
    );

        
    console.log("upload");
   
  }
}

  

  
  


let dayEventIndex = new Map<number, any>();
dayEventIndex.set(0,-1)
dayEventIndex.set(1,-1)
dayEventIndex.set(2,-1)
dayEventIndex.set(3,-1)
dayEventIndex.set(4,-1)
dayEventIndex.set(5,-1)
dayEventIndex.set(6,-1)