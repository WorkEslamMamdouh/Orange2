using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPurInvoiceRet
{
   
    public class AVATPurInvoiceRetService : IAVATPurInvoiceRetService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVATPurInvoiceRetService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public AVAT_TR_PurInvoiceRet GetById(int id)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceRet>().GetById(id);
        }

        public List<AVAT_TR_PurInvoiceRet> GetAll()
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceRet>().GetAll();
        }

        public List<AVAT_TR_PurInvoiceRet> GetAll(Expression<Func<AVAT_TR_PurInvoiceRet, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceRet>().Get(predicate);
        }

        public AVAT_TR_PurInvoiceRet Insert(AVAT_TR_PurInvoiceRet entity)
        {
            var res = unitOfWork.Repository<AVAT_TR_PurInvoiceRet>().Insert(entity);
            unitOfWork.Save();
            return res;
        }

        public AVAT_TR_PurInvoiceRet Update(AVAT_TR_PurInvoiceRet entity)
        {

            var res = unitOfWork.Repository<AVAT_TR_PurInvoiceRet>().Update(entity);
            unitOfWork.Save();
            return res;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_TR_PurInvoiceRet>().Delete(id);
            unitOfWork.Save();
        }

        
        #endregion
    }




}
