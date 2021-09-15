import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { $ } from 'protractor';
import { Role } from './Role.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isEditable: boolean = true;
  RoleCreateForm: FormGroup;
  submitted = false;
  model = Role;
  modules = [];
  constructor(private fb: FormBuilder, private httpClient : HttpClient) {
    this.getModules();
    this.createForm();
  }
 
  headers = ["MODULES", "EDIT", "CREATE", "VIEW", "DELETE"];
  ngOnInit(): void {
    console.log(this.modules);
  }
  


  public get helper() {
    return this.RoleCreateForm.controls;
  }

  getModules(){
    this.httpClient.get<any>('https://localhost:44383/api/module')
      .subscribe(
        (data)=> 
        {
          debugger
          this.modules =  data.map(o => {
            return { name: o.name};
          });;
          console.log(this.modules)
        },
        (err) => console.log(err),
        ()=>{
          let arr = [];
      for (let i = 0; i < this.modules.length; i++) {
      arr.push(this.BuildFormDynamic(this.modules[i]))

    }
    this.RoleCreateForm = this.fb.group({
      moduleName: [''],
      permissions: this.fb.array(arr)
    })
        });
}
  createForm() {
    debugger
    let arr = [];
    for (let i = 0; i < this.modules.length; i++) {
      arr.push(this.BuildFormDynamic(this.modules[i]))

    }
    this.RoleCreateForm = this.fb.group({
      moduleName: [''],
      permissions: this.fb.array(arr)
    })
  }
  get formData() { return <FormArray>this.RoleCreateForm.controls.permissions; }

  BuildFormDynamic(moduleData): FormGroup {
    return this.fb.group({
      moduleName: [moduleData.name],
      canEdit: [false],
      canDelete: [false],
      canView: [false],
      canCreate: [false]
    })
  }

  SaveData() {
    Object.assign(this.model,this.RoleCreateForm.value);
    var obj = {
      RoleId : 0,
      RoleName : this.RoleCreateForm.value.moduleName,
      RoleModules : this.RoleCreateForm.value.permissions
    }
    this.httpClient.post('https://localhost:44383/api/Role/addRole',obj)
    .subscribe((data)=>console.log(data));
  }

  onCancel() {

  }

}


