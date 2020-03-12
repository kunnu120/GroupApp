import { Component } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   projects = [];

  constructor(
    private router: Router,
    public projectService: ProjectService,
    public userService: UserService
  ) {
    var db = firebase.firestore();
    var self = this;
    var user = firebase.auth().currentUser;

    var ref = firebase.database().ref("projects/");
    ref.on('value', resp =>{console.log("items loaded")})

    //Loop Through Projects with Current User in team array
  db.collection("projects").where("team", "array-contains",user.uid).onSnapshot(function(querySnapshot) {
    console.log("Projects for " + user.email + " Loading......");
    querySnapshot.forEach(function(doc) {
    var projectI = doc.data();
    var projectId = doc.id;
     
    //Add Projects to Array
    self.projects.push({    
    id:projectI.id,           
    name:projectI.name,
    description:projectI.description,
    dueDate: projectI.dueDate,
    owner: projectI.owner,
    dateCreated: projectI.dateCreated,
    tasks: projectI.tasks,
    meetings: projectI.meetings,
    team: projectI.team,
    complete: projectI.complete,
    percentComplete: projectI.percentComplete});
  });
    console.log(self.projects);
    console.log("Projects Loaded");
} )
  }


ngOnInit(){
  console.log("Current User: " + firebase.auth().currentUser.email)

}
 
  goToSettings(){
    this.router.navigate(["/settings"])
  }

  goToProfile(){
    this.router.navigate(["/user-profile"])
  }

  goToCreateProject(){
    this.router.navigate(["/create-project"])
  }

  goToProject(project){
    console.log("Getting Details for: " + project.Name);
    this.router.navigate(["project-detail",project])
  }
}
