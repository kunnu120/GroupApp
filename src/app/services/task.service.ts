import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor( 
    private projectService: ProjectService,
    public router: Router) { }
 
  createTask(title,description,emails,percentage,projectId){
    //Generate ID for Task
    var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
    //Add Task
    var db = firebase.firestore();
    db.collection("tasks").add({
      'id':id,
      'title': title,
      'description':description,
      'emails':emails,
      'percentage': percentage,
      'projectId':projectId,
      'complete': false
    })
    .then(function(docRef) {
       console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    db.collection("tasks").where("id","==",id).get().then((snapshot) =>{snapshot.docs.forEach(doc => {
      var task = doc.data();
      
      //Add Task to Project in Project Service
      this.projectService.addTask(projectId,task);

    })
    });
  }

  deleteTask(id,projectId){
    var db = firebase.firestore();
    var taskId;
    db.collection("tasks").where("id","==",id).get().then((snapshot) =>{snapshot.docs.forEach(doc => {
      var task = doc.data();
      console.log(task)
      taskId = doc.id

      //Remove Task From Project in Project Service
      this.projectService.removeTask(projectId,task);

      //Delete Task
      db.collection("tasks").doc(taskId).delete().then(function() {
        console.log("Document successfully deleted!");
        console.log("Task deleted")
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
    })
    });
  }

  completeTask(id,projectId){
    var db = firebase.firestore();
    var taskId;
    db.collection("tasks").where("id","==",id).get().then((snapshot) =>{snapshot.docs.forEach(doc => {
      taskId = doc.id
      var oldTask = doc.data()

      //Remove the Incomplete Task from project
      this.projectService.removeTask(projectId,oldTask)

      //Update Tasks
      var taskRef =db.collection("tasks").doc(taskId)
      taskRef.update({complete: true})
      
      //Add Completed Task
      var newTask = {
        'id':oldTask.id,
        'title': oldTask.title,
        'description':oldTask.description,
        'emails':oldTask.emails,
        'percentage': oldTask.percentage,
        'projectId':oldTask.projectId,
        'complete': true
      }
      this.projectService.addTask(projectId,newTask)
      this.projectService.completeTask(projectId,newTask.percentage)
    })
    })

  }

  incompleteTask(id,projectId){
    var db = firebase.firestore();
    var taskId;
    db.collection("tasks").where("id","==",id).get().then((snapshot) =>{snapshot.docs.forEach(doc => {
      taskId = doc.id
      var oldTask = doc.data()

      //Remove the Complete Task from project
      this.projectService.removeTask(projectId,oldTask)

      //Update Tasks
      var taskRef =db.collection("tasks").doc(taskId)
      taskRef.update({complete: false})
      
      //Add InCompleted Task
      var newTask = {
        'id':oldTask.id,
        'title': oldTask.title,
        'description':oldTask.description,
        'emails':oldTask.emails,
        'percentage': oldTask.percentage,
        'projectId':oldTask.projectId,
        'complete': false
      }
      this.projectService.addTask(projectId,newTask)
      this.projectService.incompleteTask(projectId,newTask.percentage)
    })
    })

  }

  updateTask(newValues){
    console.log(newValues.id);

    //Update Task
    firebase.database().ref('tasks/'+newValues.id).update(newValues);
  }
}
