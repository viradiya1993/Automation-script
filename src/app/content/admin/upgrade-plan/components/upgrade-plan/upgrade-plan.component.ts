import { Component, OnInit } from '@angular/core';
import { LicenseTypeService } from '@app/core/services';

@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit {
  licenseDetails = [];
  monthly: boolean = true;
  yearly: boolean = false;
  selectedColor: number = 0;

  constructor(private paymentService: LicenseTypeService) { }

  ngOnInit(): void {
   this.getPlanDetails();
  }


  //get plan details
  getPlanDetails() {
    this.paymentService.getLincense().subscribe((res: any) => {
      console.log(res,'up');
      this.licenseDetails = res.details;
    });
  }

  //switch Plan
  switchPlan(event: any) {
    if (event === 'monthly') {
      this.monthly = true;
      this.yearly = false;
    } else {
      this.yearly = true;
      this.monthly = false;
    }
  }

  //select plan
  planSelect(index: number) {
    this.selectedColor = index;
  }

  isActive(item) {
    return this.selectedColor === item;
  }
}
