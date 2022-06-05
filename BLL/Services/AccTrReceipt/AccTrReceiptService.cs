using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccTrReceipt
{//A_RecPay_Tr_ReceiptNote
    public class AccTrReceiptService: IAccTrReceiptService
    {

        private readonly IUnitOfWork unitOfWork;

        public AccTrReceiptService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region AccTrReceiptService Services
        public A_RecPay_Tr_ReceiptNote GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_Tr_ReceiptNote>().GetById(id);
        }

        public List<A_RecPay_Tr_ReceiptNote> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_Tr_ReceiptNote>().GetAll();
        }

        public List<A_RecPay_Tr_ReceiptNote> GetAll(Expression<Func<A_RecPay_Tr_ReceiptNote, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_Tr_ReceiptNote>().Get(predicate);
        }

        public A_RecPay_Tr_ReceiptNote Insert(A_RecPay_Tr_ReceiptNote entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_RecPay_Tr_ReceiptNote>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_RecPay_Tr_ReceiptNote Update(A_RecPay_Tr_ReceiptNote entity)
        {

            var vendor = unitOfWork.Repository<A_RecPay_Tr_ReceiptNote>().Update(entity);
            unitOfWork.Save();
            return vendor;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_Tr_ReceiptNote>().Delete(id);
            unitOfWork.Save();
        }
       
        #endregion
    }
}
