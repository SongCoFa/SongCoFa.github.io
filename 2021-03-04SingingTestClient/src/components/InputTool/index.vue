<template>
  <div class="row">
    <component
      v-for="(item, index) in list"
      :is="item.name"
      :key="index"
      :defaultInput="item.defaultInput || null"
      :required="item.isRequired"
      :class="[item.name === 'VoucherDeparture' || item.name === 'VoucherArrival' ? 'col-12' : inputClasses]"
      :selectedInput="selectedInput"
      @updateInput="setInput"
    />
  </div>
</template>

<script>
import StartDate from '@/components/InputTool/Extend/StartDate.vue';
import EndDate from '@/components/InputTool/Extend/EndDate.vue';
import EmployeeName from '@/components/InputTool/Extend/EmployeeName.vue';
import EmployeeNumber from '@/components/InputTool/Extend/EmployeeNumber.vue';
import EmployeeIDName from '@/components/InputTool/Extend/EmployeeIDName.vue';
import EmployeeNameID from '@/components/InputTool/Extend/EmployeeNameID.vue';
import EmployeeIDSelection from '@/components/InputTool/Extend/EmployeeNameIDSelection.vue';
import EmployeeContainsExpired from '@/components/InputTool/Extend/EmployeeContainsExpired.vue';
import AccountSelection from '@/components/InputTool/Extend/AccountSelection.vue';
import EmployeeInSalaryMonth from '@/components/InputTool/Extend/EmployeeInSalaryMonth.vue';
import Department from '@/components/InputTool/Extend/Department.vue';
import DepartmentWithoutDriver from '@/components/InputTool/Extend/DepartmentWithoutDriver.vue';
import DepartmentAll from '@/components/InputTool/Extend/DepartmentAll.vue';
import Date from '@/components/InputTool/Extend/Date.vue';
import Year from '@/components/InputTool/Extend/Year.vue';
import Month from '@/components/InputTool/Extend/Month.vue';
import Hours from '@/components/InputTool/Extend/Hours.vue';
import OperationFunctions from '@/components/InputTool/Extend/OperationFunctions.vue';

import Title from '@/components/InputTool/Extend/Title.vue';
import TitleInAccount from '@/components/InputTool/Extend/TitleInAccount.vue';
import StationNumber from '@/components/InputTool/Extend/StationNumber.vue';
import ActivateDate from '@/components/InputTool/Extend/ActivateDate.vue';
import Mobile from '@/components/InputTool/Extend/Mobile.vue';
import Birthday from '@/components/InputTool/Extend/Birthday.vue';
import AnnualLeave from '@/components/InputTool/Extend/AnnualLeave.vue';

import VehicleBrand from '@/components/InputTool/Extend/VehicleBrand.vue';
import VehicleNumber from '@/components/InputTool/Extend/VehicleNumber.vue';
import VehicleYearOfManufacture from '@/components/InputTool/Extend/VehicleYearOfManufacture.vue';

import RouteName from '@/components/InputTool/Extend/RouteName.vue';
import RouteNumber from '@/components/InputTool/Extend/RouteNumber.vue';
import RoutePrefix from '@/components/InputTool/Extend/RoutePrefix.vue';
import SubRouteName from '@/components/InputTool/Extend/SubRouteName.vue';
import SubRouteUID from '@/components/InputTool/Extend/SubRouteUID.vue';
import DisplayRouteID from '@/components/InputTool/Extend/DisplayRouteID.vue';
import RouteDirection from '@/components/InputTool/Extend/RouteDirection.vue';
import DepartureStopNameZh from '@/components/InputTool/Extend/DepartureStopNameZh.vue';
import DestinationStopNameZh from '@/components/InputTool/Extend/DestinationStopNameZh.vue';
import Distance from '@/components/InputTool/Extend/Distance.vue';
import DistanceSpecial from '@/components/InputTool/Extend/DistanceSpecial.vue';
import IntermediateStations from '@/components/InputTool/Extend/IntermediateStations.vue';

import LeaveDate from '@/components/InputTool/Extend/LeaveDate.vue';
import LeaveStartDate from '@/components/InputTool/Extend/LeaveStartDate.vue';
import LeaveEndDate from '@/components/InputTool/Extend/LeaveEndDate.vue';
import LeaveType from '@/components/InputTool/Extend/LeaveType.vue';
import LeaveDays from '@/components/InputTool/Extend/LeaveDays.vue';
import LeaveEmployee from '@/components/InputTool/Extend/LeaveEmployee.vue';

import SpecialShiftName from '@/components/InputTool/Extend/SpecialShiftName.vue';
import SpecialDate from '@/components/InputTool/Extend/SpecialDate.vue';
import SpecialStartDate from '@/components/InputTool/Extend/SpecialStartDate.vue';
import SpecialEndDate from '@/components/InputTool/Extend/SpecialEndDate.vue';
import SpecialWeekday from '@/components/InputTool/Extend/SpecialWeekday.vue';
import SpecialRemark from '@/components/InputTool/Extend/SpecialRemark.vue';

import HolidayName from '@/components/InputTool/Extend/HolidayName.vue';
import HolidayStartDate from '@/components/InputTool/Extend/HolidayStartDate.vue';
import HolidayEndDate from '@/components/InputTool/Extend/HolidayEndDate.vue';

import DepartureTime from '@/components/InputTool/Extend/DepartureTime.vue';

import TripRoute from '@/components/InputTool/Extend/TripRoute.vue';
import TripActiveDate from '@/components/InputTool/Extend/TripActiveDate.vue';
import TripExpireDate from '@/components/InputTool/Extend/TripExpireDate.vue';
import IsMonday from '@/components/InputTool/Extend/IsMonday.vue';
import IsTuesday from '@/components/InputTool/Extend/IsTuesday.vue';
import IsWednesday from '@/components/InputTool/Extend/IsWednesday.vue';
import IsThursday from '@/components/InputTool/Extend/IsThursday.vue';
import IsFriday from '@/components/InputTool/Extend/IsFriday.vue';
import IsSaturday from '@/components/InputTool/Extend/IsSaturday.vue';
import IsSunday from '@/components/InputTool/Extend/IsSunday.vue';

import VoucherDate from '@/components/InputTool/Extend/VoucherDate.vue';
import VoucherEmployee from '@/components/InputTool/Extend/VoucherEmployee.vue';
import VoucherDeparture from '@/components/InputTool/Extend/VoucherDeparture.vue';
import VoucherArrival from '@/components/InputTool/Extend/VoucherArrival.vue';
import VoucherRemark from '@/components/InputTool/Extend/VoucherRemark.vue';
import VoucherDirection from '@/components/InputTool/Extend/VoucherDirection.vue';
import VoucherIntermediateStations from '@/components/InputTool/Extend/VoucherIntermediateStations.vue';
import VoucherRouteName from '@/components/InputTool/Extend/VoucherRouteName.vue';
import VoucherRoute from '@/components/InputTool/Extend/VoucherRoute.vue';
import VoucherDistance from '@/components/InputTool/Extend/VoucherDistance.vue';
import VoucherVehicle from '@/components/InputTool/Extend/VoucherVehicle.vue';
import ProfilePermission from '@/components/InputTool/Extend/PermissionOfProfile.vue';
import SchedulePermission from '@/components/InputTool/Extend/PermissionOfSchedule.vue';
import SalaryPermission from '@/components/InputTool/Extend/PermissionOfSalary.vue';

import BasicPayment from '@/components/InputTool/Extend/Salary/BasicPayment.vue';
import FoodAllowance from '@/components/InputTool/Extend/Salary/FoodAllowance.vue';
import PensionCompany from '@/components/InputTool/Extend/Salary/PensionCompany.vue';
import LaborInsuranceFee from '@/components/InputTool/Extend/Salary/LaborInsuranceFee.vue';
import HealthInsuranceFee from '@/components/InputTool/Extend/Salary/HealthInsuranceFee.vue';
import WelfareFee from '@/components/InputTool/Extend/Salary/WelfareFee.vue';
import PensionPersonal from '@/components/InputTool/Extend/Salary/PensionPersonal.vue';
import InsuranceFee from '@/components/InputTool/Extend/Salary/InsuranceFee.vue';
import NightAllowance from '@/components/InputTool/Extend/Salary/NightAllowance.vue';
import SpecialAllowance from '@/components/InputTool/Extend/Salary/SpecialAllowance.vue';
import MileageAllowance from '@/components/InputTool/Extend/Salary/MileageAllowance.vue';
import TransportationAllowance from '@/components/InputTool/Extend/Salary/TransportationAllowance.vue';
import TwocarsAllowance from '@/components/InputTool/Extend/Salary/TwocarsAllowance.vue';
import ExtraShuttleAllowance from '@/components/InputTool/Extend/Salary/ExtraShuttleAllowance.vue';
import SeasonBonus from '@/components/InputTool/Extend/Salary/SeasonBonus.vue';
import YearEndBonus from '@/components/InputTool/Extend/Salary/YearEndBonus.vue';
import BonusCash from '@/components/InputTool/Extend/Salary/BonusCash.vue';
import ConsolationMoney from '@/components/InputTool/Extend/Salary/ConsolationMoney.vue';
import Tip from '@/components/InputTool/Extend/Salary/Tip.vue';
import TravelAllowance from '@/components/InputTool/Extend/Salary/TravelAllowance.vue';
import EducationAllowance from '@/components/InputTool/Extend/Salary/EducationAllowance.vue';
import Loan from '@/components/InputTool/Extend/Salary/Loan.vue';
import IncomeTax from '@/components/InputTool/Extend/Salary/IncomeTax.vue';
import MiscellaneousFee from '@/components/InputTool/Extend/Salary/MiscellaneousFee.vue';
import SupplementFee from '@/components/InputTool/Extend/Salary/SupplementFee.vue';
import Withholding from '@/components/InputTool/Extend/Salary/Withholding.vue';
import CarDamageSharing from '@/components/InputTool/Extend/Salary/CarDamageSharing.vue';
import IncidentSharing from '@/components/InputTool/Extend/Salary/IncidentSharing.vue';
import InsuranceSharing from '@/components/InputTool/Extend/Salary/InsuranceSharing.vue';
import OtherBonus from '@/components/InputTool/Extend/Salary/OtherBonus.vue';
import Annualday from '@/components/InputTool/Extend/Annualday.vue';

export default {
  name: 'Input',
  components: {
    StartDate,
    EndDate,
    EmployeeName,
    EmployeeNumber,
    EmployeeIDSelection,
    EmployeeIDName,
    EmployeeNameID,
    EmployeeContainsExpired,
    EmployeeInSalaryMonth,
    AccountSelection,
    Department,
    DepartmentWithoutDriver,
    DepartmentAll,
    Date,
    Year,
    Month,
    Hours,
    OperationFunctions,
    Title,
    TitleInAccount,
    StationNumber,
    ActivateDate,
    Mobile,
    Birthday,
    AnnualLeave,
    VehicleBrand,
    VehicleNumber,
    VehicleYearOfManufacture,
    RouteName,
    RouteNumber,
    RoutePrefix,
    SubRouteName,
    SubRouteUID,
    DisplayRouteID,
    RouteDirection,
    DepartureStopNameZh,
    DestinationStopNameZh,
    Distance,
    DistanceSpecial,
    IntermediateStations,
    LeaveDate,
    LeaveStartDate,
    LeaveEndDate,
    LeaveType,
    LeaveDays,
    LeaveEmployee,
    SpecialShiftName,
    SpecialDate,
    SpecialWeekday,
    SpecialRemark,
    SpecialStartDate,
    SpecialEndDate,
    HolidayName,
    HolidayStartDate,
    HolidayEndDate,
    DepartureTime,
    TripRoute,
    TripActiveDate,
    TripExpireDate,
    IsMonday,
    IsTuesday,
    IsWednesday,
    IsThursday,
    IsFriday,
    IsSaturday,
    IsSunday,
    VoucherDate,
    VoucherEmployee,
    VoucherDeparture,
    VoucherArrival,
    VoucherRemark,
    VoucherDirection,
    VoucherIntermediateStations,
    VoucherRouteName,
    VoucherRoute,
    VoucherDistance,
    VoucherVehicle,
    ProfilePermission,
    SchedulePermission,
    SalaryPermission,
    // ------ 薪資表 ------
    BasicPayment,
    FoodAllowance,
    PensionCompany,
    LaborInsuranceFee,
    HealthInsuranceFee,
    WelfareFee,
    PensionPersonal,
    InsuranceFee,
    NightAllowance,
    SpecialAllowance,
    MileageAllowance,
    TransportationAllowance,
    TwocarsAllowance,
    ExtraShuttleAllowance,
    SeasonBonus,
    YearEndBonus,
    BonusCash,
    ConsolationMoney,
    Tip,
    TravelAllowance,
    EducationAllowance,
    Loan,
    IncomeTax,
    MiscellaneousFee,
    SupplementFee,
    Withholding,
    CarDamageSharing,
    IncidentSharing,
    InsuranceSharing,
    OtherBonus,
    Annualday,
  },
  props: {
    list: Array,
    inputClasses: Array,
    selectedInput: Object,
  },
  data() {
    return {
      userInputState: {},
      classObject: {
        inputClasses: true,
        'col-12': false,
      },
    };
  },
  watch: {
    userInputState: {
      handler(newValue) {
        const res = this.list
          .filter(item => item.isRequired)
          .every(item => newValue[item.name]);

        this.$emit('validateRequired', res);
      },
      deep: true,
    },
  },
  methods: {
    setInput(send) {
      this.$emit('updateInput', send);
      this.$set(this.userInputState, send.componentName, send.state);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
