using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.ServPurInvoiceHeader
{
   


    public class ServPurInvoiceHeaderService : IServPurInvoiceHeaderService
    {
        private readonly IUnitOfWork unitOfWork;

        public ServPurInvoiceHeaderService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public AVAT_TR_PurInvoiceHeader GetById(int id)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceHeader>().GetById(id);
        }

        public List<AVAT_TR_PurInvoiceHeader> GetAll()
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceHeader>().GetAll();
        }

        public List<AVAT_TR_PurInvoiceHeader> GetAll(Expression<Func<AVAT_TR_PurInvoiceHeader, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceHeader>().Get(predicate);
        }

        public AVAT_TR_PurInvoiceHeader Insert(AVAT_TR_PurInvoiceHeader entity)
        {
            var memb = unitOfWork.Repository<AVAT_TR_PurInvoiceHeader>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public AVAT_TR_PurInvoiceHeader Update(AVAT_TR_PurInvoiceHeader entity)
        {

            var memb = unitOfWork.Repository<AVAT_TR_PurInvoiceHeader>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_TR_PurInvoiceHeader>().Delete(id);
            unitOfWork.Save();
        }

     
        #endregion
    }
}
