using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.ServPurInvoice
{
   


    public class ServPurInvoiceService : IServPurInvoiceService
    {
        private readonly IUnitOfWork unitOfWork;

        public ServPurInvoiceService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public AVAT_TR_PurInvoice GetById(int id)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoice>().GetById(id);
        }

        public List<AVAT_TR_PurInvoice> GetAll()
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoice>().GetAll();
        }

        public List<AVAT_TR_PurInvoice> GetAll(Expression<Func<AVAT_TR_PurInvoice, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoice>().Get(predicate);
        }

        public AVAT_TR_PurInvoice Insert(AVAT_TR_PurInvoice entity)
        {
            var memb = unitOfWork.Repository<AVAT_TR_PurInvoice>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public AVAT_TR_PurInvoice Update(AVAT_TR_PurInvoice entity)
        {

            var memb = unitOfWork.Repository<AVAT_TR_PurInvoice>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_TR_PurInvoice>().Delete(id);
            unitOfWork.Save();
        }

     
        #endregion
    }
}
