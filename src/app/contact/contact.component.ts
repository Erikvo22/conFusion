import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { Component, OnInit, ViewChild } from '@angular/core';
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    flyInOut(), expand(), visibility()
  ]
})

export class ContactComponent implements OnInit {

  feedbackForm!: FormGroup;
  feedback: Feedback | null = null;
  feedbackErrMess!: string;
  contactType = ContactType;
  formVisibility: string = 'shown';
  responseVisibility: string = 'hidden';
  formErrors: {[key:string]:string} = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };
  validationMessages: {[key:string]:{[key:string]:string}}  = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  @ViewChild('fform') feedbackFormDirective!: NgForm;

  constructor(private fb: FormBuilder, private feedbackService:FeedbackService) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['',[Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data))
  }

  onValueChanged(data?:any){

    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;

    for (const field in this.formErrors) {

      if (this.formErrors.hasOwnProperty(field)) {

        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    
    this.formVisibility = 'hidden';
    if (this.feedbackForm.value !== null) {

      this.feedbackService.submitFeedback(this.feedbackForm.value)
        .subscribe(response =>{
          this.feedback = response;
          this.responseVisibility = 'shown'
          setTimeout(()=>{this.feedback = null;  this.responseVisibility = 'hidden';  this.formVisibility = 'shown';}, 5000)
        },
        errmess => {
         
          this.feedbackErrMess = <any>errmess;
          setTimeout(()=>this.formVisibility = 'shown', 5000); 
          
        });
    }
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
}
