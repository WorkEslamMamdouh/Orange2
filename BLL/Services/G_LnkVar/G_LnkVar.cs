using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_LnkVarr
{
   public class G_LnkVarService : IG_LnkVarService
    {
        private readonly IUnitOfWork unitOfWork;

        public G_LnkVarService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region VoucherTypeService Service

        public G_LnkVar GetById(int id)
        {
            return unitOfWork.Repository<G_LnkVar>().GetById(id);
        }

        public List<G_LnkVar> GetAll()
        {
            return unitOfWork.Repository<G_LnkVar>().GetAll();
        }

        public List<G_LnkVar> GetAll(Expression<Func<G_LnkVar, bool>> predicate)
        {
            return unitOfWork.Repository<G_LnkVar>().Get(predicate);
        }
        #endregion
    }
}
