import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Special } from 'src/app/models/special';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ResultService } from 'src/app/services/result.service';
@Component({
  selector: 'app-new-special-result',
  templateUrl: './new-special-result.component.html',
  styleUrls: ['./new-special-result.component.css']
})
export class NewSpecialResultComponent implements OnInit {
  @Input() specialPrediction: any;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    public resultService: ResultService,
    public alertService: AlertService
  ) { }

  public alert: any = {
    isOpen: false,
    message: "",
    type: ""
  };

  specialResultForm = this.formBuilder.group({
    result:  ["", [Validators.required]],
  })

  ngOnInit(): void {
  }


  async saveSpecialResult() {
    if (!this.specialResultForm.valid) { return; }

    try {
      const result = this.specialResultForm.value.result;
      const specialId = this.specialPrediction._id;
      const tournamentId = this.specialPrediction.tournament_id;

      const ResultResponse: any = await this.resultService.newSpecialResult({result: result}, specialId, tournamentId)

      if (ResultResponse.code === 201) {
        const timeResultShown = 3000;
        this.alertService.showAlert(this.alert, `Special prediction saved successfully!`, "success", timeResultShown);

        setTimeout(() => {
          this.activeModal.dismiss();
        }, timeResultShown)
        //this.newGame.emit(this.newGameForm.value);
        //EMIT SPECIAL
      }
      
    } catch (error: any) {
      if(error.status === 401) {
        this.authService.navigateToLogin();
      } else if (error.status === 403) {
        this.alertService.showAlert(this.alert, `You are not authorized to add a new special prediction`, "danger", -1);
      } else {
        this.alertService.showAlert(this.alert, `Special prediction could not be saved, please try again!`, "danger", -1);
      }
    }
  }


  get result() {
    return this.specialResultForm.get("result")!;
  }


}
