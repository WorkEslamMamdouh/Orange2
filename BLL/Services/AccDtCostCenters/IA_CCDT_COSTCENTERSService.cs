using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDtCostCenters
{
   

    public interface IA_CCDT_COSTCENTERSService
    {
        A_CCDT_COSTCENTERS GetById(int id);
        List<A_CCDT_COSTCENTERS> GetAll();
        List<A_CCDT_COSTCENTERS> GetAll(Expression<Func<A_CCDT_COSTCENTERS, bool>> predicate);
        A_CCDT_COSTCENTERS Insert(A_CCDT_COSTCENTERS entity);
        A_CCDT_COSTCENTERS Update(A_CCDT_COSTCENTERS entity);
        //void UpdateList(List<A_CCDT_COSTCENTERS> Lst);
        void UpdateList(List<A_CCDT_COSTCENTERS> updatedRecord);
        void Delete(int id);
        void Delete(A_CCDT_COSTCENTERS obj);
        void InsertList(List<A_CCDT_COSTCENTERS> insertedRecord);


    }


}
