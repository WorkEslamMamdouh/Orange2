using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.VchrTemplateHeader
{
 public  class VchrTemplateHeaderService : IVchrTemplateHeaderService
    {
        private readonly IUnitOfWork unitOfWork;

        public VchrTemplateHeaderService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public A_TR_VchrTemplate GetById(int id)
        {
            return unitOfWork.Repository<A_TR_VchrTemplate>().GetById(id);
        }

        public List<A_TR_VchrTemplate> GetAll(Expression<Func<A_TR_VchrTemplate, bool>> predicate)
        {
            return unitOfWork.Repository<A_TR_VchrTemplate>().Get(predicate);
        }

        public A_TR_VchrTemplate Insert(A_TR_VchrTemplate entity)
        {
            var Item = unitOfWork.Repository<A_TR_VchrTemplate>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public A_TR_VchrTemplate Update(A_TR_VchrTemplate entity)
        {

            var Item = unitOfWork.Repository<A_TR_VchrTemplate>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<A_TR_VchrTemplate> entityList)
        {
            unitOfWork.Repository<A_TR_VchrTemplate>().Update(entityList);
            unitOfWork.Save();

        }
        public void Delete(int id)
        {
            unitOfWork.Repository<A_TR_VchrTemplate>().Delete(id);
            unitOfWork.Save();
        }
    }
}
