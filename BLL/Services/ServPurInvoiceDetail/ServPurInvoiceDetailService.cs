using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ServPurInvoiceDetail
{
   
    public class ServPurInvoiceDetailService : IServPurInvoiceDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public ServPurInvoiceDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region Nationality Services
        public AVAT_TR_PurInvoiceDetail GetById(int id)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().GetById(id);
        }

        public List<AVAT_TR_PurInvoiceDetail> GetAll()
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().GetAll();
        }

        public List<AVAT_TR_PurInvoiceDetail> GetAll(Expression<Func<AVAT_TR_PurInvoiceDetail, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().Get(predicate);
        }

        public AVAT_TR_PurInvoiceDetail Insert(AVAT_TR_PurInvoiceDetail entity)
        {
            var memb = unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public AVAT_TR_PurInvoiceDetail Update(AVAT_TR_PurInvoiceDetail entity)
        {

            var memb = unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().Delete(id);
            unitOfWork.Save();
        }

        public void InsertList(List<AVAT_TR_PurInvoiceDetail> obj)
        {
            unitOfWork.Repository<AVAT_TR_PurInvoiceDetail>().Insert(obj);
            unitOfWork.Save();
        }

   
        #endregion
    }







}
