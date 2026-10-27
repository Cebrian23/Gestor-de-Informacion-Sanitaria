import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import AddDocument from './Forms/AddDocument.tsx';
import AddNewDoctor from './Forms/AddNewDoctor.tsx';
import Login from './Forms/Login.tsx';
import Register from './Forms/Register.tsx';
import UpdateUser from './Forms/UpdateUser.tsx';
import ShowDoctors from './Pages/ShowDoctors.tsx';
import UserPage from './Pages/UserPage.tsx';
import AddAppointment from './Forms/AddNewAppointment.tsx';
import ShowAppointments from './Pages/ShowAppointments.tsx';
import ShowMedicines from './Pages/ShowMedicines.tsx';
import ShowMedicine from './Pages/ShowMedicine.tsx';
import AddMedicine from './Forms/AddMedicine.tsx';
import AddNewMedicine from './Forms/AddNewMedicine.tsx';
import AddMidMedicine from './Forms/AddMidMedicine.tsx';
import ShowBloodTests from './Pages/ShowBloodTests.tsx';
import ShowBloodTest from './Pages/ShowBloodTest.tsx';
import TableNameSelection from './Pages/TableNameSelection.tsx';
import DataComparison from './Pages/DataComparison.tsx';
import TableParameterSelection from './Pages/TableParameterSelection.tsx';
import UserInfo from './Pages/UserInfo.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="initialInformation" element={<UserInfo/>}/>
          <Route path="userPage" element={<UserPage/>}/>
          <Route path="updateUser" element={<UpdateUser/>}/>
          <Route path="addDocument" element={<AddDocument/>}/>
          <Route path="addDoctor" element={<AddNewDoctor/>}/>
          <Route path="addAppointment" element={<AddAppointment/>}/>
          <Route path="addMidMedicine" element={<AddMidMedicine/>}/>
          <Route path="addNewMedicine" element={<AddNewMedicine/>}/>
          <Route path="addMedicine" element={<AddMedicine/>}/>
          <Route path="showUserDoctors" element={<ShowDoctors/>}/>
          <Route path="showUserAppointment" element={<ShowAppointments/>}/>
          <Route path="showUserMedicines" element={<ShowMedicines/>}/>
          <Route path="showUserMedicine" element={<ShowMedicine/>}/>
          <Route path="showUserBloodTests" element={<ShowBloodTests/>}/>
          <Route path="showUserBloodTest" element={<ShowBloodTest/>}/>
          <Route path="tableNameSelection" element={<TableNameSelection/>}/>
          <Route path="tableDataSelection" element={<TableParameterSelection/>}/>
          <Route path="tableDataComparison" element={<DataComparison/>}/>
          <Route path="*" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;