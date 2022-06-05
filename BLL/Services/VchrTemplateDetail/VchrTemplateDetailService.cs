using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.VchrTemplateDetail
{
 public  class VchrTemplateDetailService : IVchrTemplateDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public VchrTemplateDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public A_TR_VchrTemplateDetail GetById(int id)
        {
            return unitOfWork.Repository<A_TR_VchrTemplateDetail>().GetById(id);
        }

        public List<A_TR_VchrTemplateDetail> GetAll(Expression<Func<A_TR_VchrTemplateDetail, bool>> predicate)
        {
            return unitOfWork.Repository<A_TR_VchrTemplateDetail>().Get(predicate);
        }

        public List<GQ_GetLnkVoucherDetail> GetAllFromView(Expression<Func<GQ_GetLnkVoucherDetail, bool>> predicate)
        {
            return unitOfWork.Repository<GQ_GetLnkVoucherDetail>().Get(predicate);
        }

        public A_TR_VchrTemplateDetail Insert(A_TR_VchrTemplateDetail entity)
        {
            var Item = unitOfWork.Repository<A_TR_VchrTemplateDetail>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public A_TR_VchrTemplateDetail Update(A_TR_VchrTemplateDetail entity)
        {

            var Item = unitOfWork.Repository<A_TR_VchrTemplateDetail>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<A_TR_VchrTemplateDetail> entityList)
        {
            unitOfWork.Repository<A_TR_VchrTemplateDetail>().Update(entityList);
            unitOfWork.Save();

        }
        public void Delete(int id)
        {
            unitOfWork.Repository<A_TR_VchrTemplateDetail>().Delete(id);
            unitOfWork.Save();
        }
    }
}
