using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPurInvoiceRetDetail
{
   

    public class AVATPurInvoiceRetDetailService : IAVATPurInvoiceRetDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVATPurInvoiceRetDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public AVAT_TR_PurInvoiceRetDetail GetById(int id)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceRetDetail>().GetById(id);
        }

        public List<AVAT_TR_PurInvoiceRetDetail> GetAll()
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceRetDetail>().GetAll();
        }

        public List<AVAT_TR_PurInvoiceRetDetail> GetAll(Expression<Func<AVAT_TR_PurInvoiceRetDetail, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_TR_PurInvoiceRetDetail>().Get(predicate);
        }

        public AVAT_TR_PurInvoiceRetDetail Insert(AVAT_TR_PurInvoiceRetDetail entity)
        {
            var res = unitOfWork.Repository<AVAT_TR_PurInvoiceRetDetail>().Insert(entity);
            unitOfWork.Save();
            return res;
        }

        public AVAT_TR_PurInvoiceRetDetail Update(AVAT_TR_PurInvoiceRetDetail entity)
        {

            var res = unitOfWork.Repository<AVAT_TR_PurInvoiceRetDetail>().Update(entity);
            unitOfWork.Save();
            return res;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_TR_PurInvoiceRetDetail>().Delete(id);
            unitOfWork.Save();
        }


        #endregion
    }

}
