const form = document.getElementById("form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const dashboard = document.getElementById("dashboard");
const descError = document.getElementById("descError");
const transaction = document.getElementById("transaction");
const tincome = document.getElementById("tincome");
const tbalance = document.getElementById("tbalance");
const texpense = document.getElementById("texpense");
const closebtn = document.getElementById("close");
let totalIncome;
let totalExpense;
let totalBalance;

let data = [];
let fdata = data;

// header section to display total income , expense and balance

const totalExp = () => {
  totalIncome = 0;
  totalExpense = 0;
  data
    .filter((e) => e.type === "Income")
    .map((e) => {
      totalIncome += parseInt(e.amount);
    });
  data
    .filter((e) => e.type === "Expense")
    .map((e) => {
      totalExpense += parseInt(e.amount);
    });
  totalBalance =   totalIncome - totalExpense
  tincome.innerHTML = `₹${totalIncome.toLocaleString('en-IN')}`;
  texpense.innerHTML = `₹${totalExpense.toLocaleString('en-IN')}`;
  tbalance.innerHTML = `₹${totalBalance.toLocaleString('en-IN')}`;
  
};

// form to open when click Add income/expense & edit income/expense

const IEform = (e) => {
  closebtn.classList.remove("hidden");
  form.classList.remove("hidden");
  form.classList.add("flex", "flex-col");
  dashboard.classList.add("hidden");
  type.value = e.value;
  document.getElementById("form-title").innerText = `Enter ${e.value} details`;
};


// transaction filter all , income and expense 

const filterTrans = (e) => {
  if (e.value === "Income") {
    fdata = data.filter((ele,y) => ele.type === "Income");
  } else if (e.value === "Expense") {
    fdata = data.filter((ele) => ele.type === "Expense");
  } else {
    fdata = data.filter((ele) => ele);
  }
  createTransaction(e.value);
};

// form submit btn  and close btn 

form.addEventListener("submit", (e) => {
  if (e.submitter.id === "submit") {
    e.preventDefault();
    formValidation();
  } else {
    e.preventDefault();
    form.classList.add("hidden");
    form.reset();
    descError.innerHTML = "";
    dashboard.classList.remove("hidden");
  }
});

// form validation 

const formValidation = () => {
  if (description.value === "" || amount.value === "") {
    descError.innerHTML = "Input Fields Cannot be Empty";
    descError.style.color = 'red'
  } else {
    descError.innerHTML = "Data Saved Successfully";
    descError.classList.add('text-green-500','bg-white','p-2')

    setTimeout(() => {
        getData();
    }, 1000);

    
  }
};

// After form submit datas store to array and localStorage 

const getData = () => {
  data.push({
    type: type.value,
    description: description.value,
    amount: amount.value,

  });
  fdata = data.filter((ele) => ele);
  localStorage.setItem("data", JSON.stringify(data));
  form.classList.add("hidden");
  form.reset();
  descError.innerHTML = "";
  descError.classList.remove('text-green-500','bg-white','p-2')
//   alert(`${type.value} Added`);
  dashboard.classList.remove("hidden");
  fdata = data.filter((ele) => ele);
  createTransaction("all");
};


// Display the localStorage data to transaction details 

const createTransaction = (tfilter) => {
  transaction.innerHTML = "";
  if (tfilter === 'all') {
    data.map((ele, y) => {
      transaction.innerHTML += `<tr id=${y} class="border h-10">
                  <td class="">${ele.type}</td>
                  <td class="">${ele.description}</td>
                  <td class="">₹ ${parseInt(ele.amount).toLocaleString('en-IN')}</td>
                  <td class="">
                    <button  type="button" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300" onclick="edittrans(this)">
                      edit
                    </button>
                    <button  type="button" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300" onclick="deletetrans(this)">
                      delete
                    </button>
                  </td>
                </tr>`;
    });
  }else{
    data.filter((ele,y)=>{
      if (ele.type === tfilter) {
        transaction.innerHTML += `<tr id=${y} class="border">
                  <td class="">${ele.type}</td>
                  <td class="">${ele.description}</td>
                  <td class="">₹ ${parseInt(ele.amount).toLocaleString('en-IN')}</td>
                  <td class="">
                    <button type="button" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300" onclick="edittrans(this)">
                      edit
                    </button>
                    <button type="button" class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300" onclick="deletetrans(this)">
                      delete
                    </button>
                  </td>
                </tr>`;
        
      }
      
    })
  }

  totalExp();
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  fdata = data.filter((ele) => ele);
  createTransaction("all");
})();



// Delete the transaction

const deletetrans = (ele) => {
  ele.parentElement.parentElement.remove();
  data.splice(ele.parentElement.parentElement.id,1)
  localStorage.setItem("data", JSON.stringify(data));
  totalExp();
  createTransaction("all");
};

// Edit the transaction
const edittrans = (e) => {
  let result = e.parentElement.parentElement;
  form.classList.remove("hidden");
  form.classList.add("flex", "flex-col", "translate-x-0");
  dashboard.classList.add("hidden");
  type.value = result.children[0].innerHTML;
  description.value = result.children[1].innerHTML;
  amount.value = Number(result.children[2].innerHTML.split(" ")[1].replace(/[^0-9.-]+/g,""));

  // console.log( );
  
  document.getElementById(
    "form-title"
  ).innerText = `Edit ${type.value} details`;
  closebtn.classList.add("hidden");
  deletetrans(e);
  totalExp();
};
