using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_LnkTran
{
   public class G_LnkTransService : IG_LnkTransService
    {
        private readonly IUnitOfWork unitOfWork;

        public G_LnkTransService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region VoucherTypeService Service

        public G_LnkTrans GetById(int id)
        {
            return unitOfWork.Repository<G_LnkTrans>().GetById(id);
        }

        public List<G_LnkTrans> GetAll()
        {
            return unitOfWork.Repository<G_LnkTrans>().GetAll();
        }

        public List<G_LnkTrans> GetAll(Expression<Func<G_LnkTrans, bool>> predicate)
        {
            return unitOfWork.Repository<G_LnkTrans>().Get(predicate);
        }
        #endregion
    }
}
