import dataset from "../data/data";
import { useState, useEffect } from "react";
import "./rewards.css";
const Rewardspoint = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setData(dataset);
    }, 500);
  }, []); // get data

  const calculatePoint = (amount) => {
    let point = 0;
    if (amount > 50 && amount <= 100) {
      point += (amount - 50) * 1;
    } else if (amount > 100) {
      point += (amount - 100) * 2 + 50 * 1;
    } 
    return point;
  }; // function use to calculate the points for each transaction
  
  const newdata = data.map((ele) => {
    return { ...ele, rewardspoint: calculatePoint(ele.purchasecost) };
  }); // add rewardspoint porperty into dataset

  const uniqueCustomer = [...new Set(newdata.map((item) => item.customer))]; // find unique customer name
  
  const month = [...new Set(newdata.map((item) => { 
    const checkmonth = new Date(item.purchasedate)
    return checkmonth.toLocaleString('default', { month: 'long' })
  }))] // find all unique month in the dataset

  const eachcustomer = uniqueCustomer.map(value => {
     return {name : value, array:newdata.filter(ele =>{
      return ele.customer === value
    })}
  }) // filter the dataset by the customer name, use to calculate the total points for each customer

  const eachmonth = month.map(value => {
    return {month : value, array:newdata.filter(ele =>{
      const checkmonth = new Date(ele.purchasedate)
     return checkmonth.toLocaleString('default', { month: 'long' })  === value
   })}
 }) // filter the dataset by Month

 const monthlyreport = eachmonth.map(ele =>{
  const customerpermonth = uniqueCustomer.map(value => {
    return {name : value, uniquearray :ele.array.filter(item =>{
      return item.customer === value
    } 
    )}}
  )
  return {Month : ele.month , array: customerpermonth}
}) // filter the dataset by Month, and each month filter by the customer

const  monthlyreportfinal= monthlyreport.map( (elemonth) =>{
  const report = elemonth.array.map(item =>{
    const totalpoints = item.uniquearray.reduce((total,eachpurchase) =>{return total + eachpurchase.rewardspoint},0)
    return {Name : item.name, points : totalpoints}
  })
  return {M : elemonth.Month , reports : report}
}) // finally, re-struture the dataset for giveing monthly reports

  return (<div className="whole">
    <div className="datatable">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Purchase Amount</th>
            <th>Date</th>
            <th>Reward points</th>
          </tr>
        </thead>
        {newdata.map((ele) => {
          return (
            <tr>
              <td>{ele.customer}</td>
              <td>{ele.purchasecost}</td>
              <td>{ele.purchasedate}</td>
              <td>{ele.rewardspoint}</td>
            </tr>
          );
        })}
      </table>
    </div>
      <div className="monthlysummary">
        <br />
        <h1>Monthly Reports</h1>
        <br />
        {monthlyreportfinal.map(item =>{
          return  item.reports.map(ele=>{
            return <div>{item.M} : {ele.Name} -- {ele.points} points</div>
          })
        })}

        <h3>Total Awards points</h3>
        {
          eachcustomer.map(ele =>{
            const totalpoints = ele.array.reduce((total,eachpurchase) =>{return total + eachpurchase.rewardspoint},0)
            return <div>Customer : {ele.name} --- total awards points : {totalpoints} points</div>
          })
        }
      </div>
      </div>
  );
};

export default Rewardspoint;
