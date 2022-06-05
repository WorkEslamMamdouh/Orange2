using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.SalesTrans
{
   public interface ISalesTranservice
    {
        // header
        I_TR_OperationTF GetById(int id);
        List<I_TR_OperationTF> GetAll(Expression<Func<I_TR_OperationTF, bool>> predicate);
        I_TR_OperationTF Insert(I_TR_OperationTF entity);
        I_TR_OperationTF Update(I_TR_OperationTF entity);
        void UpdateList(List<I_TR_OperationTF> Lstservice);

        //Detail
        List<I_TR_OperationTFDetail> GetAll(Expression<Func<I_TR_OperationTFDetail, bool>> predicate);
        void InsertLst(List<I_TR_OperationTFDetail> obj);
        I_TR_OperationTFDetail Insert(I_TR_OperationTFDetail entity);
        I_TR_OperationTFDetail Update(I_TR_OperationTFDetail entity);
        void Delete(int id);
    }
}
