using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.OperationSalesmanItem
{
    public class OperationSalesmanItemsService : IOperationSalesmanItemsService
    {
        private readonly IUnitOfWork unitOfWork;

        public OperationSalesmanItemsService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public void InsertLst(List<I_TR_OperationSalesmanItem> obj)
        {
            unitOfWork.Repository<I_TR_OperationSalesmanItem>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_TR_OperationSalesmanItem Insert(I_TR_OperationSalesmanItem entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_TR_OperationSalesmanItem>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_TR_OperationSalesmanItem Update(I_TR_OperationSalesmanItem entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_TR_OperationSalesmanItem>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_OperationSalesmanItem>().Delete(id);
            unitOfWork.Save();
        }
    }
}
