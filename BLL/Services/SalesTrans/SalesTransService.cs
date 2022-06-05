using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.SalesTrans
{
    public class SalesTransService : ISalesTranservice
    {
        private readonly IUnitOfWork unitOfWork;

        public SalesTransService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region Header Services
        public I_TR_OperationTF GetById(int id)
        {
            return unitOfWork.Repository<I_TR_OperationTF>().GetById(id);
        }

        public List<I_TR_OperationTF> GetAll(Expression<Func<I_TR_OperationTF, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_OperationTF>().Get(predicate);
        }

        public I_TR_OperationTF Insert(I_TR_OperationTF entity)
        {
            var Item = unitOfWork.Repository<I_TR_OperationTF>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public I_TR_OperationTF Update(I_TR_OperationTF entity)
        {

            var Item = unitOfWork.Repository<I_TR_OperationTF>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<I_TR_OperationTF> entityList)
        {
            unitOfWork.Repository<I_TR_OperationTF>().Update(entityList);
            unitOfWork.Save();

        }
        #endregion

        #region Detail Services
        public List<I_TR_OperationTFDetail> GetAll(Expression<Func<I_TR_OperationTFDetail, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_OperationTFDetail>().Get(predicate);
        }

        public void InsertLst(List<I_TR_OperationTFDetail> obj)
        {
            unitOfWork.Repository<I_TR_OperationTFDetail>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_TR_OperationTFDetail Insert(I_TR_OperationTFDetail entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_TR_OperationTFDetail>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_TR_OperationTFDetail Update(I_TR_OperationTFDetail entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_TR_OperationTFDetail>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_OperationTFDetail>().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
