using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Glnktrans
{
   public class GlnktransService : IGlnktransService
    {
        private readonly IUnitOfWork unitOfWork;

        public GlnktransService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region VoucherTypeService Service

        public GQ_GetLnkTransComp GetById(int id)
        {
            return unitOfWork.Repository<GQ_GetLnkTransComp>().GetById(id);
        }

        public List<GQ_GetLnkTransComp> GetAll()
        {
            return unitOfWork.Repository<GQ_GetLnkTransComp>().GetAll();
        }

        public List<GQ_GetLnkTransComp> GetAll(Expression<Func<GQ_GetLnkTransComp, bool>> predicate)
        {
            return unitOfWork.Repository<GQ_GetLnkTransComp>().Get(predicate);
        }
        #endregion
    }
}
